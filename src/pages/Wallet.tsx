import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Wallet as WalletIcon, Receipt, Plus, Activity, Minus } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { PageLoader } from "@/components/PageLoader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { authPathWithNext } from "@/lib/authRedirect";
import { formatCoins, formatTimestamp, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

const Wallet = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // `user` stays null until the persisted session has been read, so
    // redirecting before that settles bounced signed-in visitors to the
    // sign-in page on every hard refresh of this route.
    if (authLoading) return;

    if (!user) {
      navigate(authPathWithNext("/wallet"));
      return;
    }

    const fetchWalletData = async () => {
      const [{ data: walletData }, { data: transactionsData }] = await Promise.all([
        supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (walletData) setBalance(walletData.balance);
      setTransactions((transactionsData as Transaction[]) || []);
      setLoading(false);
    };

    fetchWalletData();
  }, [user, authLoading, navigate]);

  const summary = useMemo(() => {
    const credits = transactions.filter((t) => t.amount > 0);
    const debits = transactions.filter((t) => t.amount < 0);
    return {
      credits: credits.reduce((sum, t) => sum + t.amount, 0),
      debits: Math.abs(debits.reduce((sum, t) => sum + t.amount, 0)),
      count: transactions.length,
    };
  }, [transactions]);

  const renderTable = (rows: Transaction[]) => (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((transaction) => {
            // A zero-amount entry is neither a credit nor a debit; treating it
            // as a debit rendered "0 EC" in red with a down arrow.
            const isZero = transaction.amount === 0;
            const isCredit = transaction.amount > 0;
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <span className="inline-flex items-center gap-2 font-medium text-foreground">
                    {isZero ? (
                      <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    ) : isCredit ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                    )}
                    {titleCase(transaction.transaction_type)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.description || "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatTimestamp(transaction.created_at)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    isZero ? "text-muted-foreground" : isCredit ? "text-success" : "text-destructive",
                  )}
                >
                  {formatCoins(transaction.amount, { signed: !isZero })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );

  if (loading) {
    return (
      <AppLayout>
        <PageLoader label="Loading wallet" />
      </AppLayout>
    );
  }

  const all = transactions;
  const credits = transactions.filter((t) => t.amount > 0);
  const debits = transactions.filter((t) => t.amount < 0);

  return (
    <AppLayout contained={false}>
      <PageHeader
        eyebrow="Account"
        title="Wallet"
        description="Your balance, and everything that has moved through it. Sales land here once the buyer confirms delivery — not before."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Wallet" }]}
        actions={
          <Button asChild>
            <Link to="/create-listing">
              <Plus className="h-4 w-4" />
              Sell an item
            </Link>
          </Button>
        }
      />

      <div className="container space-y-8 py-8 md:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Available balance"
            value={balance.toLocaleString("en-GB")}
            unit="EC"
            icon={WalletIcon}
            hint="Ready to spend or withdraw"
          />
          <StatCard
            label="Total credited"
            value={summary.credits.toLocaleString("en-GB")}
            unit="EC"
            icon={ArrowUpRight}
            hint="Sales, commissions, top-ups"
          />
          <StatCard
            label="Total debited"
            value={summary.debits.toLocaleString("en-GB")}
            unit="EC"
            icon={ArrowDownRight}
            hint="Purchases and fees"
          />
          <StatCard
            label="Recent entries"
            value={summary.count}
            icon={Activity}
            // The query is capped at 50, so this is not a lifetime total.
            hint={summary.count >= 50 ? "Showing the latest 50" : "Most recent movements"}
          />
        </div>

        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Badge variant="info">Escrow</Badge>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Funds held for open orders are not included in your available balance. They are released to the seller
              when the buyer confirms delivery.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/my-orders">View orders</Link>
          </Button>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All activity</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="debits">Debits</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-6">
            {all.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="Nothing has moved yet"
                description="Sales, purchases and commission all land here once they settle. It's a very quiet page at the moment."
                action={
                  <Button asChild>
                    <Link to="/marketplace">Go and spend some</Link>
                  </Button>
                }
              />
            ) : (
              renderTable(all)
            )}
          </TabsContent>

          <TabsContent value="credits" className="pt-6">
            {credits.length === 0 ? (
              <EmptyState
                icon={ArrowUpRight}
                title="No money in"
                description="Completed sales and affiliate commission turn up here. Selling something is the fastest way to change that."
              />
            ) : (
              renderTable(credits)
            )}
          </TabsContent>

          <TabsContent value="debits" className="pt-6">
            {debits.length === 0 ? (
              <EmptyState
                icon={ArrowDownRight}
                title="No money out"
                description="Purchases and platform fees are listed here. Nothing has been charged yet, which is nice."
              />
            ) : (
              renderTable(debits)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Wallet;
