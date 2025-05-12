import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RoomsPage from "./pages/RoomsPage";
import ChatPage from "./pages/ChatPage";
import VideoPage from "./pages/VideoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/about" element={<NotFound />} />
            <Route path="/privacy" element={<NotFound />} />
            <Route path="/terms" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
