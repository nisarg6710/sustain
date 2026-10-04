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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { authPathWithNext } from "@/lib/authRedirect";
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

/**
 * Actions for a single order. Only the order being acted on should show
 * in-flight state, so this is driven by `activeOrderId` rather than a
 * page-wide boolean.
 */
const OrderActions = ({
  order,
  isSeller,
  trackingNumber,
  onTrackingChange,
  onConfirmDelivery,
  onDispatched,
  confirming,
}: {
  order: Order;
  isSeller: boolean;
  trackingNumber: string;
  onTrackingChange: (value: string) => void;
  onConfirmDelivery: () => void;
  onDispatched: () => void;
  confirming: boolean;
}) => {
  if (isSeller && order.status === "pending") {
    return (
      <Dialog onOpenChange={(open) => !open && onTrackingChange("")}>
        <DialogTrigger asChild>
          <Button size="xs" variant="outline" className="w-full sm:w-auto">
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
              onChange={(event) => onTrackingChange(event.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onTrackingChange.bind(null, "")}>
              Cancel
            </Button>
            <Button onClick={onDispatched}>Confirm dispatch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isSeller && order.status === "shipped") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="xs" className="w-full sm:w-auto">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {confirming ? "Confirming…" : "Confirm delivery"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm you received this item</AlertDialogTitle>
            <AlertDialogDescription>
              This releases the escrowed {order.amount_ecocoins} EcoCoins to the seller and cannot be undone. Only
              confirm once the item is in your hands.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirming}>Not yet</AlertDialogCancel>
            <Button onClick={onConfirmDelivery} disabled={confirming}>
              {confirming ? "Confirming…" : "Release payment"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (isSeller && order.status === "shipped") {
    return <span className="text-xs text-muted-foreground">Awaiting buyer</span>;
  }

  if (order.status === "completed") {
    return <span className="text-xs text-muted-foreground">Settled</span>;
  }

  if (order.status === "cancelled") {
    return <span className="text-xs text-muted-foreground">Closed</span>;
  }

  return null;
};

interface OrderListProps {
  orders: Order[];
  isSeller: boolean;
  trackingNumber: string;
  confirmingId: string | null;
  onTrackingChange: (value: string) => void;
  onConfirmDelivery: (orderId: string) => void;
  onMarkShipped: (orderId: string) => void;
}

/** Table for md and up. */
const OrderTable = ({
  orders,
  isSeller,
  trackingNumber,
  confirmingId,
  onTrackingChange,
  onConfirmDelivery,
  onMarkShipped,
}: OrderListProps) => (
  <Card className="hidden overflow-hidden md:block">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
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
                    <p className="truncate text-xs text-muted-foreground">Tracking {order.tracking_number}</p>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              <span title={order.id}>{order.id.slice(0, 8)}</span>
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right">
              <EcoCoinAmount value={order.amount_ecocoins} size="sm" />
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(order.created_at)}</TableCell>
            <TableCell className="text-right">
              <OrderActions
                order={order}
                isSeller={isSeller}
                trackingNumber={trackingNumber}
                onTrackingChange={onTrackingChange}
                onConfirmDelivery={() => onConfirmDelivery(order.id)}
                onDispatched={() => onMarkShipped(order.id)}
                confirming={confirmingId === order.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

/** Stacked cards below md, where a 6-column table would push the primary
    action off-screen behind the horizontal scroller. */
const OrderCards = ({
  orders,
  isSeller,
  trackingNumber,
  confirmingId,
  onTrackingChange,
  onConfirmDelivery,
  onMarkShipped,
}: OrderListProps) => (
  <div className="space-y-3 md:hidden">
    {orders.map((order) => (
      <Card key={order.id} className="p-4">
        <div className="flex items-start gap-3">
          <ListingThumbnail
            photo={order.listings?.photos?.[0]}
            title={order.listings?.title ?? "Item"}
            className="h-12 w-12 shrink-0 rounded-md border border-border"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-medium text-foreground">
              {order.listings?.title ?? "Item unavailable"}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              <span title={order.id}>{order.id.slice(0, 8)}</span>
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <StatusBadge status={order.status} />
          <EcoCoinAmount value={order.amount_ecocoins} size="sm" />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Ordered {formatDate(order.created_at)}
          {order.tracking_number && ` · Tracking ${order.tracking_number}`}
        </p>

        <div className="mt-3 border-t border-border pt-3">
          <OrderActions
            order={order}
            isSeller={isSeller}
            trackingNumber={trackingNumber}
            onTrackingChange={onTrackingChange}
            onConfirmDelivery={() => onConfirmDelivery(order.id)}
            onDispatched={() => onMarkShipped(order.id)}
            confirming={confirmingId === order.id}
          />
        </div>
      </Card>
    ))}
  </div>
);

const OrderList = (props: OrderListProps) => (
  <>
    <OrderTable {...props} />
    <OrderCards {...props} />
  </>
);

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [buyerOrders, setBuyerOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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
    // `user` is null until the persisted session resolves, so redirecting
    // before that settles bounced signed-in visitors to /auth on refresh.
    if (authLoading) return;

    if (!user) {
      navigate(authPathWithNext("/my-orders"));
      return;
    }
    fetchOrders();
  }, [user, authLoading, navigate, fetchOrders]);

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
    fetchOrders();
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirmingId(orderId);

    const { data, error } = await supabase.functions.invoke("confirm-delivery", { body: { orderId } });

    if (error || data?.error) {
      console.error("confirm-delivery invoke failed:", error);
      toast({
        title: "Confirmation unavailable",
        description: data?.error || (await describeEdgeFunctionError(error, "delivery confirmation")),
        variant: "destructive",
      });
      setConfirmingId(null);
      return;
    }

    toast({ title: "Delivery confirmed", description: "Escrow has been released to the seller." });
    burstConfetti({ count: 90, origin: { x: window.innerWidth / 2, y: window.innerHeight * 0.45 } });
    setConfirmingId(null);
    fetchOrders();
  };

  const stats = useMemo(() => {
    const all = [...buyerOrders, ...sellerOrders];
    const open = all.filter((order) => order.status === "pending" || order.status === "shipped");
    const value = all.reduce((sum, order) => sum + (order.amount_ecocoins ?? 0), 0);
    return { total: all.length, open: open.length, value };
  }, [buyerOrders, sellerOrders]);


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
        description="Things you've bought, and things other people have bought off you. Money moves when delivery is confirmed, so the tracking number matters."
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

      <div className="container space-y-8 py-8 md:py-10">
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
              <Badge variant="secondary" className="ml-2 tabular-nums">
                {buyerOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sales">
              Sales
              <Badge variant="secondary" className="ml-2 tabular-nums">
                {sellerOrders.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="pt-6">
            {buyerOrders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="You haven't bought anything yet"
                description="Anything you buy shows up here with its tracking number, and a button to confirm it arrived. That button is what releases the seller's money, so use it when it's genuinely in your hands."
                action={
                  <Button asChild>
                    <Link to="/marketplace">Find something</Link>
                  </Button>
                }
              />
            ) : (
              <OrderList
                orders={buyerOrders}
                isSeller={false}
                trackingNumber={trackingNumber}
                confirmingId={confirmingId}
                onTrackingChange={setTrackingNumber}
                onConfirmDelivery={handleConfirmDelivery}
                onMarkShipped={handleMarkAsShipped}
              />
            )}
          </TabsContent>

          <TabsContent value="sales" className="pt-6">
            {sellerOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Nothing sold yet"
                description="List something and it'll appear here the moment an order lands. You record the tracking number, the buyer confirms it arrived, and then you get paid."
                action={
                  <Button asChild>
                    <Link to="/create-listing">List something</Link>
                  </Button>
                }
              />
            ) : (
              <OrderList
                orders={sellerOrders}
                isSeller
                trackingNumber={trackingNumber}
                confirmingId={confirmingId}
                onTrackingChange={setTrackingNumber}
                onConfirmDelivery={handleConfirmDelivery}
                onMarkShipped={handleMarkAsShipped}
              />
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
