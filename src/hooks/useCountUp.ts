import { useEffect, useState } from "react";

interface CountUpOptions {
  duration?: number;
  decimals?: number;
  /** Gate the animation, e.g. on the element being scrolled into view. */
  start?: boolean;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates from zero to `target` with an ease-out curve. Falls straight to the
 * final value when the user prefers reduced motion or when `start` is false.
 */
export const useCountUp = (target: number, { duration = 1500, decimals = 0, start = true }: CountUpOptions = {}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    let frame = 0;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Number((target * eased).toFixed(decimals)));

      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, decimals, start]);

  return value;
};
