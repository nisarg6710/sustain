import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, LayoutGrid, PackageSearch, Plus, Rows3, Search, SlidersHorizontal } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard, EcoCoinAmount, ListingThumbnail } from "@/components/ListingCard";
import { conditionVariant, formatCategory, formatCondition, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  category: string;
  condition: string;
  price_ecocoins: number;
  photos: string[] | null;
  description: string | null;
  created_at: string | null;
}

const categories = [
  { value: "all", label: "All categories" },
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home & garden" },
  { value: "sports", label: "Sports & outdoors" },
  { value: "books", label: "Books & media" },
  { value: "toys", label: "Toys & games" },
];

const conditions = [
  { value: "all", label: "Any condition" },
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title", label: "Title A–Z" },
];

type ViewMode = "grid" | "table";

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  // The query and the category live in the URL, not in component state. Search
  // used to reset on every refresh and could not be shared or linked, which made
  // a filtered result set impossible to send to someone else or bookmark.
  const searchQuery = searchParams.get("q") ?? "";
  const categoryFilter = searchParams.get("category") ?? "all";
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [savedOnly, setSavedOnly] = useState(false);
  const { ids: savedIds, count: savedCount } = useWishlist();

  const fetchListings = useCallback(async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Unable to load listings",
        description: "The marketplace could not be reached. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setListings((data as Listing[]) || []);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  /**
   * Writes a filter to the URL, replacing rather than pushing so typing in the
   * search box does not fill the history with one entry per keystroke.
   */
  const updateFilter = (key: "q" | "category", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const handleCategoryChange = (value: string) => {
    updateFilter("category", value === "all" ? "" : value);
  };

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = listings.filter((listing) => {
      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        (listing.description ?? "").toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
      const matchesCondition = conditionFilter === "all" || listing.condition === conditionFilter;
      const matchesSaved = !savedOnly || savedIds.includes(listing.id);
      return matchesSearch && matchesCategory && matchesCondition && matchesSaved;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price_ecocoins - b.price_ecocoins;
        case "price-desc":
          return b.price_ecocoins - a.price_ecocoins;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      }
    });
  }, [listings, searchQuery, categoryFilter, conditionFilter, sort, savedOnly, savedIds]);

  const filtersActive =
    categoryFilter !== "all" || conditionFilter !== "all" || searchQuery.trim() !== "" || savedOnly;

  const resetFilters = () => {
    setConditionFilter("all");
    setSavedOnly(false);
    setSearchParams({}, { replace: true });
  };

  return (
    <AppLayout contained={false}>
      <PageHeader
        eyebrow="Marketplace"
        title="Live inventory"
        description="Every listing is escrowed on settlement, verified for condition and reported for environmental impact."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Marketplace" }]}
        actions={
          <Button asChild>
            <Link to="/create-listing">
              <Plus className="h-4 w-4" />
              List an item
            </Link>
          </Button>
        }
        meta={
          <div className="flex flex-wrap items-center gap-2">
            {/* The count changes on every keystroke; announce it politely so
                screen-reader users get feedback as filters change. */}
            <div role="status" aria-live="polite">
              <Badge variant="outline" className="tabular-nums">
                {loading ? "Loading inventory" : `${filteredListings.length} of ${listings.length} listings`}
              </Badge>
            </div>
            {savedCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Heart className="h-3 w-3 fill-current" />
                {savedCount} saved
              </Badge>
            )}
            {filtersActive && (
              <Button variant="ghost" size="xs" onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </div>
        }
      />

      <div className="container py-8 md:py-10">
        <Card className="mb-8 p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
            <div className="space-y-2">
              <Label htmlFor="marketplace-search">Search inventory</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="marketplace-search"
                  placeholder="Search by title or description"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(event) => updateFilter("q", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category-filter" className="w-full lg:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition-filter">Condition</Label>
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger id="condition-filter" className="w-full lg:w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sorted by</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-8 w-[190px] border-0 bg-transparent px-0 text-sm font-medium text-foreground shadow-none hover:border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Grid
              </Button>
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setView("table")}
                aria-pressed={view === "table"}
              >
                <Rows3 className="h-3.5 w-3.5" />
                Table
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="eyebrow-muted">
              Quick filters
            </span>
            <Button
              variant={savedOnly ? "default" : "outline"}
              size="xs"
              onClick={() => setSavedOnly((current) => !current)}
              aria-pressed={savedOnly}
            >
              <Heart className={cn("h-3.5 w-3.5", savedOnly && "fill-current")} />
              Saved items
              {savedCount > 0 && (
                <span
                  className={cn(
                    "ml-0.5 rounded px-1 text-[11px] tabular-nums",
                    savedOnly ? "bg-primary-foreground/20" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {savedCount}
                </span>
              )}
            </Button>
            {categories
              .filter((category) => category.value !== "all")
              .slice(0, 4)
              .map((category) => (
                <Button
                  key={category.value}
                  variant={categoryFilter === category.value ? "secondary" : "ghost"}
                  size="xs"
                  onClick={() => handleCategoryChange(categoryFilter === category.value ? "all" : category.value)}
                >
                  {category.label}
                </Button>
              ))}
          </div>
        </Card>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="shimmer aspect-[4/3] w-full" />
                <div className="space-y-3 p-5">
                  <div className="shimmer h-3 w-20 rounded" />
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-4 w-16 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <EmptyState
            icon={savedOnly && savedCount > 0 ? Heart : PackageSearch}
            title={
              savedOnly && savedCount > 0
                ? "No saved items match these filters"
                : filtersActive
                  ? "No inventory matches these filters"
                  : "No active listings yet"
            }
            description={
              savedOnly && savedCount > 0
                ? "Your saved items are hidden by the current search or category filter."
                : filtersActive
                  ? "Adjust or clear your filters to see the full catalogue."
                  : "Be the first to publish an item and start earning EcoCoins."
            }
            action={
              filtersActive ? (
                <Button variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => navigate("/create-listing")}>
                  <Plus className="h-4 w-4" />
                  Create the first listing
                </Button>
              )
            }
          />
        ) : view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[38%]">Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Listed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} className="relative hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ListingThumbnail
                          photo={listing.photos?.[0]}
                          title={listing.title}
                          className={cn("h-11 w-11 shrink-0 rounded-md border border-border")}
                        />
                        <Link
                          to={`/product/${listing.id}`}
                          className="line-clamp-1 font-medium text-foreground after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatCategory(listing.category)}</TableCell>
                    <TableCell>
                      <Badge variant={conditionVariant[listing.condition] ?? "secondary"}>
                        {formatCondition(listing.condition)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <EcoCoinAmount value={listing.price_ecocoins} size="sm" />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatDate(listing.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Marketplace;
