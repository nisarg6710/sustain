import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Camera, Check, Info, Plus, Sparkles, Trash2, Upload } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { describeEdgeFunctionError } from "@/lib/edgeFunctions";
import { authPathWithNext } from "@/lib/authRedirect";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 10;

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home & garden" },
  { value: "sports", label: "Sports & outdoors" },
  { value: "books", label: "Books & media" },
  { value: "toys", label: "Toys & games" },
];

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

interface Valuation {
  ecoCoins?: number;
  justification?: string;
  carbonOffset?: number;
  wasteReduction?: string;
  sustainabilityImpact?: string;
}

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [shipping, setShipping] = useState("seller-ships");
  const [returns, setReturns] = useState("no-returns");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    description: "",
    price: "",
  });

  // Only the first three stages are requirements — publishing is the action,
  // not something the seller can tick off.
  const requirements = [
    { id: "media", label: "Media", done: photos.length > 0 },
    {
      id: "details",
      label: "Item details",
      done: Boolean(formData.title && formData.category && formData.condition && formData.description),
    },
    { id: "pricing", label: "Pricing", done: Number(formData.price) > 0 },
  ];

  const completedCount = requirements.filter((requirement) => requirement.done).length;
  const readyToPublish = completedCount === requirements.length;

  const stepStates = [
    ...requirements.map((requirement, index) => ({
      key: requirement.id,
      label: requirement.label,
      state: requirement.done ? "done" : completedCount === index ? "active" : "todo",
    })),
    { key: "publish", label: "Publish", state: readyToPublish ? "active" : "todo" },
  ] as const;

  const resetForm = () => {
    setPhotos([]);
    setFormData({ title: "", category: "", condition: "", description: "", price: "" });
    setValuation(null);
    setShipping("seller-ships");
    setReturns("no-returns");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need an account to publish a listing.",
        variant: "destructive",
      });
      navigate(authPathWithNext("/create-listing"));
      return;
    }

    const priceValue = parseInt(formData.price || String(valuation?.ecoCoins ?? "0"), 10);

    if (photos.length === 0) {
      toast({ title: "Media required", description: "Add at least one photo.", variant: "destructive" });
      return;
    }
    if (!formData.title.trim()) {
      toast({ title: "Title required", description: "Enter a clear, descriptive title.", variant: "destructive" });
      return;
    }
    if (!formData.category) {
      toast({ title: "Category required", description: "Select a category.", variant: "destructive" });
      return;
    }
    if (!formData.condition) {
      toast({ title: "Condition required", description: "Select the item condition.", variant: "destructive" });
      return;
    }
    if (!(priceValue > 0)) {
      toast({
        title: "Price required",
        description: "Set a price in EcoCoins or request an AI valuation.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      price_ecocoins: priceValue,
      sustainability_impact: valuation?.sustainabilityImpact ?? null,
      photos,
      status: "active",
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Could not publish listing",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Listing published", description: "Your item is now live in the marketplace." });
    burstConfetti({ count: 110 });
    resetForm();
    navigate("/marketplace");
  };

  const handleValuation = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Valuation is available to registered accounts.",
        variant: "destructive",
      });
      navigate(authPathWithNext("/create-listing"));
      return;
    }
    if (photos.length === 0) {
      toast({
        title: "Media required",
        description: "Upload at least one photo before requesting a valuation.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.title || !formData.category || !formData.condition) {
      toast({
        title: "Incomplete details",
        description: "Add a title, category and condition before requesting a valuation.",
        variant: "destructive",
      });
      return;
    }

    setAnalysing(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-valuation", {
        body: {
          imageUrl: photos[0],
          title: formData.title,
          condition: formData.condition,
          category: formData.category,
          description: formData.description,
        },
      });

      if (error) {
        console.error("ai-valuation invoke failed:", error);
        throw new Error(await describeEdgeFunctionError(error, "valuation"));
      }

      if (!data) {
        throw new Error("The valuation service returned an empty response. Please try again.");
      }

      setValuation(data);
      setFormData((prev) => ({ ...prev, price: String(data?.ecoCoins ?? "") }));
      toast({ title: "Valuation complete", description: "A recommended price has been applied." });
    } catch (error) {
      toast({
        title: "Valuation unavailable",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalysing(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!user) {
      // The file input is unreachable while signed out, but a session can lapse
      // between the picker opening and the file being chosen.
      toast({
        title: "Sign in required",
        description: "Photos are uploaded to your account so they stay attached to your listing.",
        variant: "destructive",
      });
      navigate(authPathWithNext("/create-listing"));
      return;
    }

    if (photos.length + files.length > MAX_PHOTOS) {
      toast({
        title: "Photo limit reached",
        description: `You can attach up to ${MAX_PHOTOS} photos per listing.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const extension = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${index}.${extension}`;

        const { error: uploadError } = await supabase.storage.from("listing-photos").upload(path, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("listing-photos").getPublicUrl(path);

        uploadedUrls.push(publicUrl);
      }

      setPhotos((prev) => [...prev, ...uploadedUrls]);
      toast({ title: "Media uploaded", description: `${uploadedUrls.length} photo(s) attached.` });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Photos could not be uploaded. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <AppLayout contained={false}>
      <PageHeader
        eyebrow="Seller workspace"
        title="Create a listing"
        description="Publish an item to the marketplace. The valuation service will propose a price once media and core attributes are complete."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Marketplace", to: "/marketplace" }, { label: "Create listing" }]}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            {stepStates.map((step, index) => (
              <span
                key={step.key}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
                  step.state === "done" && "border-success/30 bg-success/10 text-success",
                  step.state === "active" && "border-primary/30 bg-primary/5 text-primary",
                  step.state === "todo" && "border-border text-muted-foreground",
                )}
              >
                {step.state === "done" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="tabular-nums">{index + 1}</span>
                )}
                {step.label}
              </span>
            ))}
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="container grid gap-8 py-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Up to {MAX_PHOTOS} photos. The first image is used as the cover across the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {photos.map((photo, index) => (
                  <div key={photo} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                    <img src={photo} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                    {index === 0 && (
                      <Badge className="absolute left-2 top-2" variant="outline">
                        Cover
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/90 text-muted-foreground transition-colors hover:text-destructive focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS &&
                  (user ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-secondary/40 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-60"
                    >
                      <Camera className="h-5 w-5" />
                      <span className="text-xs font-medium">{uploading ? "Uploading…" : "Add photo"}</span>
                    </button>
                  ) : (
                    // A disabled upload tile gave no reason why, so the drop zone
                    // looked broken. This states the requirement and offers the fix.
                    <Link
                      to={authPathWithNext("/create-listing")}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 text-center text-muted-foreground transition-colors hover:border-primary/70 hover:bg-primary/10"
                    >
                      <Camera className="h-5 w-5 text-primary" />
                      <span className="text-xs font-medium text-foreground">Sign in to add photos</span>
                      <span className="text-[11px] leading-tight">
                        Uploads need an account so photos stay attached to your listing.
                      </span>
                    </Link>
                  ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Neutral, well-lit photos on a plain background produce the most reliable valuation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item details</CardTitle>
              <CardDescription>Core attributes used for categorisation, search and valuation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Canon AE-1 35mm film camera, serviced 2024"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Condition notes, included accessories, service history, known faults…"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                />
                <p className="text-xs text-muted-foreground">{formData.description.length} characters</p>
              </div>

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shipping">Fulfilment</Label>
                  <Select value={shipping} onValueChange={setShipping}>
                    <SelectTrigger id="shipping">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller-ships">Seller ships</SelectItem>
                      <SelectItem value="pickup">Collection only</SelectItem>
                      <SelectItem value="both">Both offered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returns">Returns policy</Label>
                  <Select value={returns} onValueChange={setReturns}>
                    <SelectTrigger id="returns">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-returns">No returns</SelectItem>
                      <SelectItem value="7-days">7 days</SelectItem>
                      <SelectItem value="14-days">14 days</SelectItem>
                      <SelectItem value="30-days">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set your own price in EcoCoins, or apply the valuation service recommendation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="price">Asking price (EcoCoins)</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="price"
                    type="number"
                    min={1}
                    placeholder="e.g. 450"
                    value={formData.price}
                    onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleValuation}
                    disabled={analysing || uploading}
                    className="sm:w-56"
                  >
                    <Bot className="h-4 w-4" />
                    {analysing ? "Valuating…" : "Request valuation"}
                  </Button>
                </div>
                {!user && (
                  <p className="text-xs text-muted-foreground">
                    Valuation runs on our servers, so it needs a signed-in account.{" "}
                    <Link
                      to={authPathWithNext("/create-listing")}
                      className="font-medium text-primary hover:underline focus-visible:underline"
                    >
                      Sign in to unlock it
                    </Link>
                    .
                  </p>
                )}
                {valuation && (
                  <p className="text-xs text-muted-foreground">
                    Valuation applied: <span className="font-medium text-foreground">{valuation.ecoCoins} EC</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {completedCount} of {requirements.length} requirements complete
              </p>
              <p className="text-xs text-muted-foreground">
                {readyToPublish
                  ? "Ready to publish. Listings go live immediately."
                  : "Listings go live immediately once every requirement is met."}
              </p>
            </div>
            <Button type="submit" disabled={submitting || uploading} className="sm:w-48">
              <Upload className="h-4 w-4" />
              {submitting ? "Publishing…" : "Publish listing"}
            </Button>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Valuation service
              </CardTitle>
              <CardDescription>
                Returns a recommended EcoCoin price with the reasoning and impact estimate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!valuation ? (
                <div className="rounded-md border border-dashed border-border p-6 text-center">
                  <Bot className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Add media and core details, then request a valuation to populate this panel.
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border border-border bg-secondary/40 p-4">
                    <p className="eyebrow-muted">Recommended price</p>
                    <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                      {valuation.ecoCoins}
                      <span className="ml-1.5 text-sm font-medium text-muted-foreground">EC</span>
                    </p>
                  </div>

                  {valuation.justification && (
                    <div>
                      <p className="eyebrow-muted">Rationale</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {valuation.justification}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Carbon offset</dt>
                      <dd className="font-medium tabular-nums text-foreground">
                        {/* No invented default: an absent figure is reported as
                            unavailable rather than shown as a measured 12 kg. */}
                        {valuation.carbonOffset != null
                          ? `+${valuation.carbonOffset} kg CO₂e`
                          : "Not available"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Waste diverted</dt>
                      <dd className="font-medium text-foreground">
                        {valuation.wasteReduction ?? "Not available"}
                      </dd>
                    </div>
                  </dl>

                  <Button variant="outline" className="w-full" onClick={handleValuation} disabled={analysing}>
                    Re-run valuation
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing standards</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Photograph the item from multiple angles under neutral light.",
                  "Disclose every functional fault and cosmetic mark.",
                  "State service history and included accessories explicitly.",
                  "Respond to buyer questions within 24 hours.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {!user && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-foreground">Sign in to publish</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Everything you type here is kept. Signing in unlocks photo uploads, AI valuation and publishing —
                  then returns you straight to this form.
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link to={authPathWithNext("/create-listing")}>
                    <Plus className="h-4 w-4" />
                    Create an account
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </AppLayout>
  );
};

export default CreateListing;
