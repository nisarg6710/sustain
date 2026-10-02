import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Routes are already lazy, but the shared vendor code was landing in one
        // 566 kB chunk that every route paid for. Grouping by package lets a
        // visitor's first paint skip the data-grid and charting libraries
        // entirely, and lets unchanged vendor code stay cached across deploys.
        // Order matters: @radix-ui and recharts both contain "react".
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@radix-ui") || id.includes("radix-ui")) return "radix";
          if (id.includes("recharts") || id.includes("victory-vendor") || id.includes("d3-")) return "recharts";
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("react")) return "react";
          return "vendor";
        },
      },
    },
  },
}));
