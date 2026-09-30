const BRAND_COLORS = ["#1f8a5f", "#2bb673", "#f0a92b", "#146c4a", "#ffd166", "#38d39f"];

interface BurstOptions {
  /** Particle count. */
  count?: number;
  /** Launch cone width in degrees. */
  spread?: number;
  /** How long the canvas lives, in ms. */
  duration?: number;
  /** Origin as a fraction of the viewport. Defaults to top-centre. */
  origin?: { x: number; y: number };
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  shape: "rect" | "circle";
  opacity: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Dependency-free confetti burst on a transient full-screen canvas.
 * Deliberately fire-and-forget: safe to call from any success handler, and a
 * no-op when the user prefers reduced motion.
 */
export const burstConfetti = ({
  count = 90,
  spread = 62,
  duration = 2600,
  origin,
  colors = BRAND_COLORS,
}: BurstOptions = {}) => {
  if (typeof document === "undefined" || prefersReducedMotion()) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "100",
  } satisfies Partial<CSSStyleDeclaration>);

  const context = canvas.getContext("2d");
  if (!context) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  context.scale(dpr, dpr);

  document.body.appendChild(canvas);

  const startX = origin?.x ?? window.innerWidth / 2;
  const startY = origin?.y ?? window.innerHeight * 0.18;
  const halfSpread = (spread * Math.PI) / 360;

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + randomBetween(-halfSpread, halfSpread);
    const velocity = randomBetween(6, 13);

    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: randomBetween(5, 10),
      rotation: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-0.22, 0.22),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.35 ? "rect" : "circle",
      opacity: 1,
    };
  });

  const startTime = performance.now();
  let frame = 0;

  const cleanup = () => {
    cancelAnimationFrame(frame);
    canvas.remove();
  };

  const render = (now: number) => {
    const elapsed = now - startTime;
    const life = elapsed / duration;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      // Light gravity plus air drag, and a little horizontal sway.
      particle.vy += 0.22;
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      particle.x += particle.vx + Math.sin((elapsed / 260) + particle.rotation) * 0.6;
      particle.y += particle.vy;
      particle.rotation += particle.spin;

      particle.opacity = life < 0.75 ? 1 : Math.max(0, 1 - (life - 0.75) / 0.25);

      context.save();
      context.globalAlpha = particle.opacity;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;

      if (particle.shape === "rect") {
        context.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
      } else {
        context.beginPath();
        context.arc(0, 0, particle.size / 2.4, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    });

    if (life < 1) {
      frame = requestAnimationFrame(render);
    } else {
      cleanup();
    }
  };

  frame = requestAnimationFrame(render);
};
