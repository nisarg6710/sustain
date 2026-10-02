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
  // No build.rollupOptions.manualChunks here on purpose.
  //
  // Grouping vendors by hand is what removed the >500 kB chunk warning, but it
  // introduced a hard runtime failure: the catch-all bucket created a circular
  // dependency between chunks, and the browser died with
  // "Uncaught ReferenceError: Cannot access '_' before initialization" at module
  // evaluation — a blank page, before React ever mounted.
  //
  // Rollup can only order chunks safely if it derives the grouping itself. The
  // per-route `React.lazy` splitting in src/App.tsx already produces correct
  // shared chunks, so leave the grouping to it. If the warning returns, raise
  // `chunkSizeWarningLimit` rather than hand-splitting vendors.
  build: {
    // The entry chunk is React, the Supabase client and the UI primitives every
    // route shares, so it is downloaded on every page by definition. Vite's
    // default advice ("split it up") does not apply to code that cannot be
    // deferred. The charting library is already out of it — that lives in the
    // lazy /affiliate-dashboard chunk.
    chunkSizeWarningLimit: 600,
  },
}));

