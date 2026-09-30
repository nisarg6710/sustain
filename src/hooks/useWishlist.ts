import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sustain-wishlist";

/**
 * Module-level store so every mounted card stays in sync — a heart toggled on
 * one listing card immediately updates the counter and any other card.
 */
let cache: string[] | null = null;
const listeners = new Set<() => void>();

const read = (): string[] => {
  if (cache) return cache;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    cache = [];
  }

  return cache;
};

const write = (ids: string[]) => {
  cache = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode / quota) — keep the in-memory state.
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useWishlist = () => {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    return subscribe(() => setIds(read()));
  }, []);

  // Keep multiple tabs consistent.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        cache = null;
        setIds(read());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { ids, count: ids.length, has, toggle, clear };
};
