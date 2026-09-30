import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Package, ShoppingBag, Truck, Wallet as WalletIcon } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { PageLoader } from "@/components/PageLoader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { EcoCoinAmount, ListingThumbnail } from "@/components/ListingCard";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { describeEdgeFunctionError } from "@/lib/edgeFunctions";
import { burstConfetti } from "@/lib/confetti";

interface Order {
  id: string;
  amount_ecocoins: number;
  status: string;
  created_at: string;
  shipped_at: string | null;
  completed_at: string | null;
  tracking_number: string | null;
  listings: { title: string; photos: string[] | null } | null;
}

const statusConfig: Record<string, { label: string; variant: "secondary" | "info" | "success" | "destructive"; icon: typeof Clock }> = {
  pending: { label: "Awaiting dispatch", variant: "secondary", icon: Clock },
  shipped: { label: "In transit", variant: "info", icon: Truck },
  completed: { label: "Completed", variant: "success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "destructive", icon: Package },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="w-fit gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const ORDER_COLUMNS = `
  id,
  amount_ecocoins,
  status,
  created_at,
  shipped_at,
  completed_at,
  tracking_number,
  listings (title, photos)
`;

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [buyerOrders, setBuyerOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    const [buyerResult, sellerResult] = await Promise.all([
      supabase
        .from("orders")
        .select(ORDER_COLUMNS)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select(ORDER_COLUMNS)
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setBuyerOrders((buyerResult.data as Order[]) || []);
    setSellerOrders((sellerResult.data as Order[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  const handleMarkAsShipped = async (orderId: string) => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking number required",
        description: "Enter the carrier reference so the buyer can follow the shipment.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: "shipped",
        tracking_number: trackingNumber.trim(),
        shipped_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Could not update order",
        description: "The order status was not changed. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Order dispatched", description: "The buyer has been notified." });

    setTrackingNumber("");
    setActiveOrderId(null);
    fetchOrders();
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirming(true);

    const { data, error } = await supabase.functions.invoke("confirm-delivery", { body: { orderId } });

    if (error || data?.error) {
      console.error("confirm-delivery invoke failed:", error);
      toast({
        title: "Confirmation unavailable",
        description: data?.error || (await describeEdgeFunctionError(error, "delivery confirmation")),
        variant: "destructive",
      });
      setConfirming(false);
      return;
    }

    toast({ title: "Delivery confirmed", description: "Escrow has been released to the seller." });
    burstConfetti({ count: 90, origin: { x: window.innerWidth / 2, y: window.innerHeight * 0.45 } });
    setConfirming(false);
    fetchOrders();
  };

  const stats = useMemo(() => {
    const all = [...buyerOrders, ...sellerOrders];
    const open = all.filter((order) => order.status === "pending" || order.status === "shipped");
    const value = all.reduce((sum, order) => sum + (order.amount_ecocoins ?? 0), 0);
    return { total: all.length, open: open.length, value };
  }, [buyerOrders, sellerOrders]);

  const OrderTable = ({ orders, isSeller }: { orders: Order[]; isSeller: boolean }) => (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[32%]">Item</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead>Ordered</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ListingThumbnail
                    photo={order.listings?.photos?.[0]}
                    title={order.listings?.title ?? "Item"}
                    className="h-11 w-11 shrink-0 rounded-md border border-border"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {order.listings?.title ?? "Item unavailable"}
                    </p>
                    {order.tracking_number && (
                      <p className="truncate text-xs text-muted-foreground">
                        Tracking {order.tracking_number}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <EcoCoinAmount value={order.amount_ecocoins} size="sm" />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(order.created_at)}</TableCell>
              <TableCell className="text-right">
                {isSeller && order.status === "pending" && (
                  <Dialog
                    open={activeOrderId === order.id}
                    onOpenChange={(open) => {
                      setActiveOrderId(open ? order.id : null);
                      if (!open) setTrackingNumber("");
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="xs" variant="outline">
                        <Truck className="h-3.5 w-3.5" />
                        Mark dispatched
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Record dispatch</DialogTitle>
                        <DialogDescription>
                          Enter the carrier tracking reference for order {order.id.slice(0, 8)}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor={`tracking-${order.id}`}>Tracking number</Label>
                        <Input
                          id={`tracking-${order.id}`}
                          value={trackingNumber}
                          onChange={(event) => setTrackingNumber(event.target.value)}
                          placeholder="e.g. 1Z999AA10123456784"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setActiveOrderId(null)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleMarkAsShipped(order.id)}>Confirm dispatch</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {!isSeller && order.status === "shipped" && (
                  <Button
                    size="xs"
                    onClick={() => handleConfirmDelivery(order.id)}
                    disabled={confirming}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {confirming ? "Confirming…" : "Confirm delivery"}
                  </Button>
                )}

                {isSeller && order.status === "shipped" && (
                  <span className="text-xs text-muted-foreground">Awaiting buyer</span>
                )}

                {order.status === "completed" && (
                  <span className="text-xs text-muted-foreground">Settled</span>
                )}

                {order.status === "cancelled" && (
                  <span className="text-xs text-muted-foreground">Closed</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  if (loading) {
    return (
      <AppLayout>
        <PageLoader label="Loading orders" />
      </AppLayout>
    );
  }

  return (
    <AppLayout contained={false}>
      <PageHeader
        eyebrow="Account"
        title="Orders"
        description="Purchases and sales across the marketplace. Escrow releases on delivery confirmation."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Orders" }]}
        actions={
          <Button asChild variant="outline">
            <Link to="/wallet">
              <WalletIcon className="h-4 w-4" />
              View wallet
            </Link>
          </Button>
        }
      />

      <div className="container space-y-8 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total orders" value={stats.total} icon={ShoppingBag} hint="Purchases and sales" />
          <StatCard label="Open orders" value={stats.open} icon={Clock} hint="Awaiting dispatch or delivery" />
          <StatCard
            label="Order value"
            value={stats.value.toLocaleString("en-GB")}
            unit="EC"
            icon={Package}
            hint="Gross, before fees"
          />
        </div>

        <Tabs defaultValue="purchases">
          <TabsList>
            <TabsTrigger value="purchases">
              Purchases
              <span className="ml-2 rounded bg-background px-1.5 text-[11px] tabular-nums text-muted-foreground">
                {buyerOrders.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="sales">
              Sales
              <span className="ml-2 rounded bg-background px-1.5 text-[11px] tabular-nums text-muted-foreground">
                {sellerOrders.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="pt-6">
            {buyerOrders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No purchases yet"
                description="Items you buy will appear here with tracking and delivery confirmation."
                action={
                  <Button asChild>
                    <Link to="/marketplace">Browse the marketplace</Link>
                  </Button>
                }
              />
            ) : (
              <OrderTable orders={buyerOrders} isSeller={false} />
            )}
          </TabsContent>

          <TabsContent value="sales" className="pt-6">
            {sellerOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No sales yet"
                description="Publish a listing to start selling. Record dispatch once an order is placed."
                action={
                  <Button asChild>
                    <Link to="/create-listing">Create a listing</Link>
                  </Button>
                }
              />
            ) : (
              <OrderTable orders={sellerOrders} isSeller />
            )}
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground">
          Settlement disputes can be raised from any order while funds remain in escrow.
        </p>
      </div>
    </AppLayout>
  );
};

export default MyOrders;
