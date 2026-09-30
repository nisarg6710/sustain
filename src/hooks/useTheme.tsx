import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Contrast, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Theme = "light" | "dark" | "amoled";

export const THEME_STORAGE_KEY = "sustain-theme";

export const THEME_OPTIONS: { value: Theme; label: string; description: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", description: "Default workspace", icon: Sun },
  { value: "dark", label: "Dark", description: "Reduced glare", icon: Moon },
  { value: "amoled", label: "AMOLED", description: "True black", icon: Contrast },
];

export const THEME_COLORS: Record<Theme, string> = {
  light: "#f7faf8",
  dark: "#0c1a16",
  amoled: "#000000",
};

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "amoled";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(stored)) return stored;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * Applies a theme by writing classes on <html>. `amoled` also receives the
 * `dark` class so every `dark:` utility keeps working; `.amoled` is declared
 * after `.dark` in index.css, so its tokens take precedence.
 */
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "amoled");

  if (theme === "dark") root.classList.add("dark");
  if (theme === "amoled") root.classList.add("dark", "amoled");

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const handleChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(THEME_STORAGE_KEY)) return;
      setThemeState(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const order: Theme[] = ["light", "dark", "amoled"];
      return order[(order.indexOf(current) + 1) % order.length];
    });
  }, []);

  const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme, setTheme, cycleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
