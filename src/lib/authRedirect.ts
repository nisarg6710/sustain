/**
 * Auth gates used to redirect to /auth with no memory of where the visitor was,
 * so signing in dropped them on the home page and silently discarded whatever
 * they were about to do. Every gate now carries a `next` path that the Auth page
 * replays once a session exists.
 */

/**
 * `next` arrives from the URL, so it is untrusted. Only same-origin absolute
 * paths are accepted — `//evil.com` and `https://evil.com` would otherwise turn
 * the sign-in page into an open redirect.
 */
const sanitiseNext = (next: string | null | undefined): string | null => {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
};

export const readNextPath = (search: string): string | null => sanitiseNext(new URLSearchParams(search).get("next"));

export const authPathWithNext = (returnTo?: string): string => {
  const next = sanitiseNext(returnTo);
  return next ? `/auth?next=${encodeURIComponent(next)}` : "/auth";
};
