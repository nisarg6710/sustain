export const conditionVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  new: "success",
  "like-new": "info",
  good: "secondary",
  fair: "warning",
  poor: "destructive",
};

export const formatCondition = (condition?: string | null) => {
  if (!condition) return "Unspecified";
  if (condition === "like-new") return "Like new";
  return condition.charAt(0).toUpperCase() + condition.slice(1);
};

export const formatCategory = (category?: string | null) => {
  if (!category) return "Uncategorised";
  return category
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatTimestamp = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatNumber = (value: number) => value.toLocaleString("en-GB");

/**
 * Single source of truth for EcoCoin amounts. Previously four different
 * strategies were in use, so `1,234` and `1234` appeared on adjacent screens.
 * Set `signed` to always render an explicit + or −.
 */
export const formatCoins = (value: number, options?: { signed?: boolean; suffix?: boolean }) => {
  const { signed = false, suffix = true } = options ?? {};
  const sign = value < 0 ? "−" : signed ? "+" : "";
  return `${sign}${formatNumber(Math.abs(value))}${suffix ? " EC" : ""}`;
};

export const titleCase = (value?: string | null) =>
  (value ?? "")
    .split(/[_\s]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
