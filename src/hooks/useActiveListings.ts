import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { ListingSummary } from "@/components/ListingCard";

/**
 * Shared, briefly-cached read of the newest active listings.
 *
 * The hero mosaic and the product grid both need live listings. Fetching them
 * separately cost three round trips on the critical path of the homepage for one
 * piece of data, so both components ask for the same thing and a module-level
 * cache hands the second caller the first caller's result.
 *
 * Thirty seconds is long enough that the hero and the grid — which mount in the
 * same tick — never miss, and short enough that a price change or a new listing
 * shows up on a refresh rather than after a hard reload.
 */
const CACHE_TTL_MS = 30_000;

let cache: { at: number; listings: ListingSummary[] } | null = null;
const listeners = new Set<() => void>();

const read = (): ListingSummary[] => {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.listings;
  return [];
};

const write = (listings: ListingSummary[]) => {
  cache = { at: Date.now(), listings };
  listeners.forEach((listener) => listener());
};

export const useActiveListings = (limit = 20) => {
  const [listings, setListings] = useState<ListingSummary[]>(read);
  const [loading, setLoading] = useState(() => cache === null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data } = await supabase
        .from("listings")
        .select("id, title, category, condition, price_ecocoins, photos, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!active) return;
      write((data as ListingSummary[]) ?? []);
      setListings(read());
      setLoading(false);
    };

    // Someone else may have populated the cache between render and effect.
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      setListings(cache.listings);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    load();

    return () => {
      active = false;
    };
  }, [limit]);

  return { listings, loading };
};

/**
 * Head-only count of active listings, for the "N things listed" figure. Separate
 * from `useActiveListings` because a `limit` would make the number a lie and
 * counting the whole table client-side would mean fetching all of it.
 */
export const useActiveListingCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .then(({ count: total }) => {
        if (active) setCount(total ?? 0);
      });

    return () => {
      active = false;
    };
  }, []);

  return count;
};
