import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import { Nav } from "@/components/Nav";
import Index from "./pages/Index.tsx";
import Assessment from "./pages/Assessment.tsx";
import Results from "./pages/Results.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Nav />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/assessment" element={<PageTransition><Assessment /></PageTransition>} />
          <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothScroll>
          <AnimatedRoutes />
        </SmoothScroll>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
