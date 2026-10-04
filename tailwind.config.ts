import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem" },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        // Both read the CSS custom properties declared in index.css, so the
        // font stack exists in exactly one place.
        //
        // Instrument Sans is a geometric grotesque with enough oddness in the
        // terminals to not read as a default UI font. Fraunces is a variable
        // old-style with optical sizing, and is the single biggest reason this
        // stops looking like a template: no generated layout ships a serif
        // display face.
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        // Categorical series scale consumed by the Recharts wrappers in ui/chart.
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
        // Controls, inputs and small surfaces stay tight. Photography and cards
        // get the larger radii — the size difference between the two is what
        // gives the page a sense of scale.
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },
      fontSize: {
        "card-title": ["0.9375rem", { lineHeight: "1.375" }],
        lede: ["1.0625rem", { lineHeight: "1.625" }],
        "section-title": ["2rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        // Display scale. Used only with `font-display`; the leading is set tight
        // enough that a two-line headline still reads as one block.
        "display-sm": ["1.625rem", { lineHeight: "1.18", letterSpacing: "-0.018em" }],
        display: ["2.125rem", { lineHeight: "1.1", letterSpacing: "-0.024em" }],
        "display-lg": ["2.75rem", { lineHeight: "1.04", letterSpacing: "-0.028em" }],
        "display-xl": ["3.5rem", { lineHeight: "0.99", letterSpacing: "-0.032em" }],
        "display-2xl": ["4.5rem", { lineHeight: "0.94", letterSpacing: "-0.035em" }],
      },
      zIndex: {
        header: "50",
        "skip-link": "60",
        overlay: "50",
        // Mobile tab bar. Below `header` so the sticky header keeps priority
        // when the two overlap on a short landscape viewport, and well below
        // `toast` so a confirmation is never hidden behind it.
        "bottom-nav": "45",
        toast: "100",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      letterSpacing: {
        tightest: "-0.035em",
        // Eyebrows were tracked +0.16em, which is shouting. A section label is
        // a whisper; the wider tracking was part of the generated look.
        eyebrow: "0.1em",
      },
      padding: {
        // Clears the fixed mobile tab bar (h-14) plus the device safe area, so
        // the bar can never sit on top of the footer's last row.
        nav: "calc(env(safe-area-inset-bottom) + 4.25rem)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "shimmer-sweep": {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.4s ease-out both",
        "shimmer-sweep": "shimmer-sweep 1.6s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
