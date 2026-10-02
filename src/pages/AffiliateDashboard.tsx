import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, Link2, MousePointerClick, Percent, Receipt, TrendingUp } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { PageLoader } from "@/components/PageLoader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/format";
import { authPathWithNext } from "@/lib/authRedirect";

const COMMISSION_RATE = 0.1;

/** Only the strongest links are charted; past this the axis labels stop being readable. */
const MAX_CHARTED_LINKS = 8;

const earningsChartConfig = {
  commission: { label: "Commission", color: "hsl(var(--chart-1))" },
  clicks: { label: "Clicks", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


interface AffiliateLink {
  id: string;
  listing_title: string;
  link_code: string;
  clicks: number;
  earnings: number;
  sales: number;
}

interface AffiliateLinkRow {
  id: string;
  link_code: string;
  listing_id: string;
  listings: { title: string } | null;
}

const AffiliateDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAffiliate, checking } = useIsAffiliate();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [statsLoading, setStatsLoading] = useState(true);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    // `user` is null until the stored session resolves, so waiting on
    // `authLoading` avoids redirecting a signed-in visitor on refresh.
    if (authLoading) return;

    if (!user) {
      navigate(authPathWithNext("/affiliate-dashboard"));
    }
  }, [user, authLoading, navigate]);

  const fetchAffiliateStats = useCallback(async () => {
    if (!user) return;

    const [{ data: earnings }, { data: affiliateLinks }] = await Promise.all([
      supabase.from("affiliate_earnings").select("ecocoins_earned").eq("affiliate_user_id", user.id),
      supabase
        .from("affiliate_links")
        .select("id, link_code, listing_id, listings (title)")
        .eq("affiliate_user_id", user.id),
    ]);

    const earningsRows = (earnings as { ecocoins_earned: number }[]) || [];
    setTotalEarnings(earningsRows.reduce((sum, row) => sum + (row.ecocoins_earned ?? 0), 0));
    setTotalSales(earningsRows.length);

    const linkStats = await Promise.all(
      ((affiliateLinks as AffiliateLinkRow[] | null) || []).map(async (link) => {
        const [{ data: clicks }, { data: linkEarnings }] = await Promise.all([
          supabase.from("affiliate_clicks").select("id").eq("affiliate_link_id", link.id),
          supabase.from("affiliate_earnings").select("ecocoins_earned").eq("affiliate_link_id", link.id),
        ]);

        const clickCount = (clicks as { id: string }[] | null)?.length ?? 0;
        const earningsTotal =
          ((linkEarnings as { ecocoins_earned: number }[] | null) ?? []).reduce(
            (sum, row) => sum + (row.ecocoins_earned ?? 0),
            0,
          ) || 0;

        return {
          id: link.id,
          listing_title: link.listings?.title ?? "Removed listing",
          link_code: link.link_code,
          clicks: clickCount,
          earnings: earningsTotal,
          sales: (linkEarnings as unknown[] | null)?.length ?? 0,
        };
      }),
    );

    setLinks(linkStats);
    setTotalClicks(linkStats.reduce((sum, link) => sum + link.clicks, 0));
    setStatsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user && isAffiliate) {
      fetchAffiliateStats();
    }
  }, [user, isAffiliate, fetchAffiliateStats]);

  const derived = useMemo(() => {
    const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;
    const earningsPerClick = totalClicks > 0 ? totalEarnings / totalClicks : 0;
    return { conversionRate, earningsPerClick };
  }, [totalClicks, totalSales, totalEarnings]);

  /**
   * Commission per link, strongest first. The figure is a lifetime total per
   * link, not a time series — `affiliate_earnings` is only ever summed — so this
   * deliberately compares links rather than plotting a trend over time, which
   * would require inventing dates the data does not carry.
   */
  const chartData = useMemo(
    () =>
      [...links]
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, MAX_CHARTED_LINKS)
        .map((link) => ({
          name: link.listing_title.length > 26 ? `${link.listing_title.slice(0, 25)}…` : link.listing_title,
          commission: link.earnings,
          clicks: link.clicks,
          sales: link.sales,
        })),
    [links],
  );

  if (checking || (isAffiliate && statsLoading)) {
    return (
      <AppLayout>
        <PageLoader label="Loading reporting" />
      </AppLayout>
    );
  }

  if (!isAffiliate) {
    return (
      <AppLayout>
        <EmptyState
          icon={BarChart3}
          title="Affiliate access required"
          description="This reporting area is available to approved affiliate partners. Contact the partnerships team to have your account enabled."
          action={
            /* This previously fired a success toast without sending anything.
               A mailto genuinely delivers the request. */
            <Button asChild>
              <a href="mailto:support@sustain.eco?subject=Affiliate%20access%20request">
                Request affiliate access
              </a>
            </Button>
          }
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout contained={false}>
      <PageHeader
        eyebrow="Partner reporting"
        title="Affiliate performance"
        description="Attribution across every tracked link. Commission is credited to your wallet when a referred order settles."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Affiliate reporting" }]}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Approved partner</Badge>
            <Badge variant="outline">Commission {COMMISSION_RATE * 100}%</Badge>
          </div>
        }
      />

      <div className="container space-y-8 py-8 md:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Commission earned"
            value={formatNumber(totalEarnings)}
            unit="EC"
            icon={Receipt}
            hint="Credited on settlement"
          />
          <StatCard label="Total clicks" value={formatNumber(totalClicks)} icon={MousePointerClick} hint="All tracked links" />
          <StatCard
            label="Referred sales"
            value={formatNumber(totalSales)}
            icon={TrendingUp}
            hint="Completed orders"
          />
          <StatCard
            label="Conversion rate"
            value={derived.conversionRate.toFixed(1)}
            unit="%"
            icon={Percent}
            hint="Sales as a share of clicks"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Commission by link</CardTitle>
              <CardDescription>
                Lifetime EcoCoins earned, strongest {Math.min(chartData.length, MAX_CHARTED_LINKS)} link
                {chartData.length === 1 ? "" : "s"} of {links.length}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No commission data to chart yet.
                </p>
              ) : (
                <ChartContainer config={earningsChartConfig} className="h-64 w-full">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" tickLine={false} axisLine={false} width={48} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="commission" fill="var(--color-chart-2)" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic versus sales</CardTitle>
              <CardDescription>
                Clicks and referred orders per link. A tall click bar with no sales bar beside it is a
                landing-page problem, not a traffic problem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No click data to chart yet.
                </p>
              ) : (
                <ChartContainer config={earningsChartConfig} className="h-64 w-full">
                  <BarChart data={chartData} margin={{ left: 4, right: 16 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={64}
                    />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="clicks" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="sales" fill="var(--color-chart-3)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance by link</CardTitle>
            <CardDescription>
              Earnings per click averages {derived.earningsPerClick.toFixed(2)} EC across your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {links.length === 0 ? (
              <EmptyState
                icon={Link2}
                title="No tracked links yet"
                description="Affiliate links are generated automatically when you open a listing while signed in."
                className="m-6 border-0"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[38%]">Listing</TableHead>
                    <TableHead>Link code</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => {
                    const conversion = link.clicks > 0 ? (link.sales / link.clicks) * 100 : 0;
                    return (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium text-foreground">{link.listing_title}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{link.link_code}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(link.clicks)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(link.sales)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {conversion.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums text-foreground">
                          {formatNumber(link.earnings)} EC
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Account</p>
              <p className="text-xs text-muted-foreground">
                Signed in as {user?.email}. Commission rate {COMMISSION_RATE * 100}% on completed sales.
              </p>
            </div>
            <Badge variant="outline" className="w-fit">
              {links.length} active link{links.length === 1 ? "" : "s"}
            </Badge>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AffiliateDashboard;
