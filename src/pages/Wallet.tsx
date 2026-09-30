import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Wallet as WalletIcon, Receipt, Plus, Activity } from "lucide-react";

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
import { formatTimestamp, titleCase } from "@/lib/format";

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

const Wallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
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
  }, [user, navigate]);

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
            const isCredit = transaction.amount > 0;
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <span className="inline-flex items-center gap-2 font-medium text-foreground">
                    {isCredit ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
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
                  className={`text-right font-medium tabular-nums ${isCredit ? "text-success" : "text-destructive"}`}
                >
                  {isCredit ? "+" : ""}
                  {transaction.amount} EC
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
        description="Your EcoCoin balance and full movement history. Settlement credits post once delivery is confirmed."
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

      <div className="container space-y-8 py-8">
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
            label="Ledger entries"
            value={summary.count}
            icon={Activity}
            hint="Most recent 50 movements"
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
                title="No wallet activity yet"
                description="Sales, purchases and commission payments will appear here as they settle."
                action={
                  <Button asChild>
                    <Link to="/marketplace">Browse the marketplace</Link>
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
                title="No credits recorded"
                description="Completed sales and affiliate commission will be credited here."
              />
            ) : (
              renderTable(credits)
            )}
          </TabsContent>

          <TabsContent value="debits" className="pt-6">
            {debits.length === 0 ? (
              <EmptyState
                icon={ArrowDownRight}
                title="No debits recorded"
                description="Purchases and platform fees will be deducted here."
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
