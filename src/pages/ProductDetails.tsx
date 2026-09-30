import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Facebook,
  Leaf,
  Link2,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Share2,
  ShieldCheck,
  Twitter,
  Wallet,
} from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageLoader } from "@/components/PageLoader";
import { EmptyState } from "@/components/EmptyState";
import { EcoCoinAmount, ListingThumbnail, WishlistButton } from "@/components/ListingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { useToast } from "@/hooks/use-toast";
import { conditionVariant, formatCategory, formatCondition, formatCoins, formatDate } from "@/lib/format";
import { describeEdgeFunctionError } from "@/lib/edgeFunctions";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  category: string;
  condition: string;
  price_ecocoins: number;
  sustainability_impact: string | null;
  photos: string[] | null;
  created_at: string | null;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const { toast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const affiliateRef = searchParams.get("ref");

  const fetchWalletBalance = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) setWalletBalance(data.balance);
  }, [user]);

  const fetchListing = useCallback(async () => {
    if (!id) return;

    const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      setListing(null);
      setLoading(false);
      return;
    }

    setListing(data as Listing);
    setLoading(false);
  }, [id]);

  const generateAffiliateLink = useCallback(async () => {
    if (!user || !id) return;

    const { data: existing } = await supabase
      .from("affiliate_links")
      .select("link_code")
      .eq("affiliate_user_id", user.id)
      .eq("listing_id", id)
      .maybeSingle();

    if (existing) {
      setAffiliateLink(`${window.location.origin}/product/${id}?ref=${existing.link_code}`);
      return;
    }

    const linkCode = `${user.id.substring(0, 8)}-${id.substring(0, 8)}`;
    const { error } = await supabase
      .from("affiliate_links")
      .insert({ affiliate_user_id: user.id, listing_id: id, link_code: linkCode });

    if (!error) {
      setAffiliateLink(`${window.location.origin}/product/${id}?ref=${linkCode}`);
    }
  }, [user, id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  useEffect(() => {
    if (user && isAffiliate) {
      generateAffiliateLink();
    }
  }, [user, isAffiliate, generateAffiliateLink]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Link copied", description: "The link is on your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const url = affiliateLink || window.location.href;
    const text = `${listing?.title} — ${listing?.price_ecocoins} EcoCoins on Sustain`;

    if (navigator.share) {
      try {
        await navigator.share({ title: listing?.title || "Listing", text, url });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = affiliateLink || window.location.href;
    const text = `Check out this item: ${listing?.title}`;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      email: `mailto:?subject=${encodeURIComponent(listing?.title || "Check this out")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    };

    const shareUrl = shareUrls[platform];
    if (!shareUrl) return;

    if (platform === "email") {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handlePurchase = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (listing && walletBalance < listing.price_ecocoins) {
      toast({
        title: "Insufficient balance",
        description: "Your wallet holds fewer EcoCoins than this listing requires.",
        variant: "destructive",
      });
      return;
    }

    setShowPurchaseDialog(true);
  };

  const confirmPurchase = async () => {
    setPurchasing(true);

    const { data, error } = await supabase.functions.invoke("process-purchase", {
      body: { listingId: id, affiliateLinkCode: affiliateRef },
    });

    if (error || data?.error) {
      console.error("process-purchase invoke failed:", error);
      toast({
        title: "Purchase unavailable",
        description: data?.error || (await describeEdgeFunctionError(error, "checkout")),
        variant: "destructive",
      });
      setPurchasing(false);
      return;
    }

    toast({ title: "Order placed", description: "The seller has been notified to dispatch." });
    burstConfetti({ count: 120, origin: { x: window.innerWidth / 2, y: window.innerHeight * 0.4 } });

    setPurchasing(false);
    setShowPurchaseDialog(false);
    navigate("/my-orders");
  };

  if (loading) {
    return (
      <AppLayout>
        <PageLoader label="Loading listing" />
      </AppLayout>
    );
  }

  if (!listing) {
    return (
      <AppLayout>
        <EmptyState
          icon={ArrowLeft}
          title="Listing unavailable"
          description="This listing may have been sold, withdrawn or removed by the seller."
          action={<Button onClick={() => navigate("/marketplace")}>Back to marketplace</Button>}
        />
      </AppLayout>
    );
  }

  const photos = listing.photos ?? [];
  const balanceAfterPurchase = walletBalance - listing.price_ecocoins;

  return (
    <AppLayout contained={false}>
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Button asChild variant="ghost" size="xs" className="-ml-2 text-muted-foreground">
            <Link to="/marketplace">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to marketplace
            </Link>
          </Button>
        </div>
      </div>

      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="overflow-hidden rounded-lg border border-border bg-secondary">
            <div className="aspect-square w-full">
              {photos.length > 0 ? (
                <img
                  src={photos[selectedImage]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ListingThumbnail photo={null} title={listing.title} className="h-full w-full" />
              )}
            </div>
          </div>

          {photos.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {photos.map((photo, index) => (
                <button
                  key={`${photo}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={selectedImage === index}
                  className={cn(
                    "aspect-square overflow-hidden rounded-md border-2 transition-colors",
                    selectedImage === index ? "border-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <Tabs defaultValue="description" className="mt-10">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specification">Specification</TabsTrigger>
              <TabsTrigger value="fulfilment">Fulfilment</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <p className="max-w-2xl text-lede leading-relaxed text-muted-foreground">
                {listing.description || "The seller has not provided a description for this item."}
              </p>
            </TabsContent>

            <TabsContent value="specification" className="pt-6">
              <dl className="max-w-2xl divide-y divide-border border-y border-border">
                {[
                  ["Reference", listing.id.slice(0, 8).toUpperCase()],
                  ["Category", formatCategory(listing.category)],
                  ["Condition", formatCondition(listing.condition)],
                  ["Published", formatDate(listing.created_at)],
                  ["Settlement currency", "EcoCoin (EC)"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-6 py-3">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="fulfilment" className="pt-6">
              <ul className="max-w-2xl space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  EcoCoins are held in escrow by Sustain and released to the seller only after you confirm delivery.
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  If the item is materially different to the description, you can raise a dispute from your order
                  history and funds remain locked while it is reviewed.
                </li>
                <li className="flex items-start gap-3">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Purchasing pre-owned avoids the manufacturing impact of an equivalent new unit.
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          {isAffiliate && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
              <Badge variant="success">Affiliate</Badge>
              <p className="text-sm leading-relaxed text-foreground">
                Share this listing to earn a 10% commission on any completed sale.
              </p>
            </div>
          )}

          <p className="eyebrow-muted">
            {formatCategory(listing.category)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{listing.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={conditionVariant[listing.condition] ?? "secondary"}>
              Condition: {formatCondition(listing.condition)}
            </Badge>
            <Badge variant="outline">Listed {formatDate(listing.created_at)}</Badge>
          </div>

          <Separator className="my-6" />

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow-muted">Asking price</p>
              <EcoCoinAmount value={listing.price_ecocoins} size="lg" className="mt-1" />
            </div>
            {user && (
              <div className="text-right">
                <p className="eyebrow-muted">
                  Wallet balance
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium tabular-nums text-foreground">
                  <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
                  {formatCoins(walletBalance)}
                </p>
              </div>
            )}
          </div>

          {listing.sustainability_impact && (
            <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-4">
              <p className="eyebrow-muted">
                Sustainability impact
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">{listing.sustainability_impact}</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handlePurchase}>
                {user ? "Purchase with EcoCoins" : "Sign in to purchase"}
              </Button>
              <WishlistButton
                id={listing.id}
                title={listing.title}
                className="static h-11 w-11 shrink-0"
              />
            </div>

            {typeof navigator !== "undefined" && navigator.share ? (
              <Button variant="outline" size="lg" className="w-full" onClick={handleNativeShare}>
                <Share2 className="h-4 w-4" />
                Share listing
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full">
                    <Share2 className="h-4 w-4" />
                    Share listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share this listing</DialogTitle>
                    <DialogDescription>
                      {isAffiliate
                        ? "Your affiliate link is attached — commission is credited automatically."
                        : "Share on social media or copy the direct link."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => shareOnSocial("linkedin")}>
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" onClick={() => shareOnSocial("twitter")}>
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Button>
                    <Button variant="outline" onClick={() => shareOnSocial("facebook")}>
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Button>
                    <Button variant="outline" onClick={() => shareOnSocial("whatsapp")}>
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>

                  <Separator />

                  <Button variant="outline" className="w-full" onClick={() => shareOnSocial("email")}>
                    <Mail className="h-4 w-4" />
                    Share via email
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <p className="eyebrow-muted">
                      {isAffiliate ? "Affiliate link" : "Direct link"}
                    </p>
                    <div className="flex gap-2">
                      <Input readOnly value={affiliateLink || window.location.href} className="text-xs" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(affiliateLink || window.location.href)}
                        aria-label="Copy link"
                      >
                        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isAffiliate && affiliateLink && (
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Link2 className="h-4 w-4 text-primary" />
                  Your affiliate link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input readOnly value={affiliateLink} className="text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(affiliateLink)}
                    aria-label="Copy affiliate link"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Commission is credited to your wallet when a buyer completes delivery confirmation.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 bg-secondary/40">
            <CardContent className="p-5">
              <p className="eyebrow-muted">
                Buyer protection
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Funds are held in escrow until you confirm delivery. Disputes are reviewed by the Sustain operations
                team and settlement is paused while a claim is open.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showPurchaseDialog}
        onOpenChange={(open) => {
          // Keep the dialog mounted while the edge function is in flight so the
          // user can see progress and recover from a failure.
          if (purchasing) return;
          setShowPurchaseDialog(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm purchase</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  You are purchasing <span className="font-medium text-foreground">{listing.title}</span> for{" "}
                  <span className="font-medium text-foreground">{listing.price_ecocoins} EcoCoins</span>.
                </p>
                <dl className="divide-y divide-border rounded-md border border-border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <dt>Current balance</dt>
                    <dd className="tabular-nums">{formatCoins(walletBalance)}</dd>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <dt>Item price</dt>
                    <dd className="tabular-nums">{formatCoins(-listing.price_ecocoins)}</dd>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <dt className="font-medium text-foreground">Balance after purchase</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {formatCoins(balanceAfterPurchase)}
                    </dd>
                  </div>
                </dl>
                <p>EcoCoins are held in escrow until you confirm delivery of the item.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={purchasing}>Cancel</AlertDialogCancel>
            {/* AlertDialogAction closes the dialog on click, which would hide
                the in-flight state. A plain Button keeps it open. */}
            <Button onClick={confirmPurchase} disabled={purchasing}>
              {purchasing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                "Confirm purchase"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ProductDetails;
