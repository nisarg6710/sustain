import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AppLayout } from "@/components/AppLayout";
import { PageLoader } from "@/components/PageLoader";

/**
 * Every page is code-split so the initial download carries only the landing page.
 * The app was a single ~708 kB chunk, which put Recharts and the whole marketplace
 * on the critical path for a visitor who only wanted to read the home page.
 */
const Index = lazy(() => import("./pages/Index"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Auth = lazy(() => import("./pages/Auth"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Legal = lazy(() => import("./pages/Legal"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Wallet = lazy(() => import("./pages/Wallet"));
const NotFound = lazy(() => import("./pages/NotFound"));

/**
 * Rendered while a route chunk downloads. It keeps the navigation and footer in
 * place, because swapping the whole shell out for a bare spinner on every
 * navigation reads as a page reload.
 */
const RouteFallback = () => (
  <AppLayout>
    <PageLoader label="Loading page…" />
  </AppLayout>
);


/**
 * Client-side routing keeps the previous scroll offset, so navigating from a
 * scrolled marketplace drops the user mid-page with focus still on the old
 * link. Reset scroll and move focus to the main landmark on every navigation.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
};

const App = () => (
  <>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/wallet" element={<Wallet />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </>
);

export default App;
