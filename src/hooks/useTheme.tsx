import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Contrast, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Theme = "light" | "dark" | "amoled";

export const THEME_STORAGE_KEY = "sustain-theme";

export const THEME_OPTIONS: { value: Theme; label: string; description: string; icon: LucideIcon }[] = [
  { value: "dark", label: "Dark", description: "The default", icon: Moon },
  { value: "light", label: "Light", description: "Daylight", icon: Sun },
  { value: "amoled", label: "AMOLED", description: "True black", icon: Contrast },
];

export const THEME_COLORS: Record<Theme, string> = {
  dark: "#0a0f0d",
  light: "#fafbf9",
  amoled: "#000000",
};

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "amoled";

/**
 * Dark unless the visitor has said otherwise.
 *
 * This used to follow `prefers-color-scheme`, which meant a first-time visitor
 * on a light-mode laptop got the light theme — and the product is designed in
 * dark. The OS preference is only consulted once a choice has been stored, and
 * after that the app stops following it (follow-up 4: the choice is still not
 * synced across tabs).
 */
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(stored)) return stored;

  return "dark";
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

  // No `prefers-color-scheme` listener any more. There used to be one, and it
  // had become dead the moment the default stopped following the OS: the effect
  // above writes a stored value on mount, so the listener's "only if the user
  // has never chosen" guard was always true. Leaving it in would have suggested
  // the app still tracked the system setting.

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const order: Theme[] = ["dark", "light", "amoled"];
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
