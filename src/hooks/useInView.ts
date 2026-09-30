import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** Stop observing after the first intersection (default) or re-trigger every time. */
  once?: boolean;
}

/**
 * Reports when an element scrolls into the viewport. Used to drive the
 * `.reveal` transitions and the count-up statistics, so motion only ever
 * plays for content the user has actually reached.
 */
export const useInView = <T extends Element>({ threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true }: UseInViewOptions = {}) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
};
