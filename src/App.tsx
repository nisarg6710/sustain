import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Auth from "./pages/Auth";
import CreateListing from "./pages/CreateListing";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import HowItWorks from "./pages/HowItWorks";
import ProductDetails from "./pages/ProductDetails";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import MyOrders from "./pages/MyOrders";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
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
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
