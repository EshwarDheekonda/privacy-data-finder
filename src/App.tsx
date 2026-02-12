
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CounterProvider } from "@/contexts/CounterContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/3d/ErrorBoundary";
import Index from "./pages/Index";
import Results from "./pages/Results";
import DetailedResults from "./pages/DetailedResults";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthDialog } from "@/components/AuthDialog";

const queryClient = new QueryClient();

const App = () => {
  const DEBUG_UI = import.meta.env.VITE_DEBUG_UI === 'true' || 
                   localStorage.getItem('debug_ui') === 'true' || 
                   new URLSearchParams(window.location.search).get('debug') === '1';
  
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    if (DEBUG_UI) console.log("🚀 App.tsx: Component mounting");
    if (DEBUG_UI) setDebugInfo(prev => [...prev, "App component mounted"]);
    
    // Ensure the title is always set correctly, overriding any dynamic changes
    document.title = "PrivacyGuard - PII Risk Assessment & Digital Privacy Protection";
    
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.error("🚨 Global Error:", event.error);
      if (DEBUG_UI) setDebugInfo(prev => [...prev, `Global Error: ${event.error?.message || 'Unknown error'}`]);
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("🚨 Unhandled Promise Rejection:", event.reason);
      if (DEBUG_UI) setDebugInfo(prev => [...prev, `Promise Rejection: ${event.reason}`]);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [DEBUG_UI]);

  if (DEBUG_UI) console.log("🔄 App.tsx: Rendering with debug info:", debugInfo);

  return (
    <div className="relative">
      {/* Debug info overlay - only show if there are errors and DEBUG_UI is enabled */}
      {DEBUG_UI && debugInfo.length > 1 && (
        <div className="fixed top-0 left-0 z-50 bg-red-500 text-white p-2 text-xs max-w-md">
          <div className="font-bold">Debug Info:</div>
          {debugInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </div>
      )}
      
      <ErrorBoundary fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">App Error Detected</h1>
            <p className="text-muted-foreground">Something went wrong. Check console for details.</p>
            <div className="text-xs text-left bg-muted p-4 rounded max-w-md">
              {debugInfo.map((info, i) => (
                <div key={i}>{info}</div>
              ))}
            </div>
          </div>
        </div>
      }>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CounterProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/detailed-results" element={<DetailedResults />} />
                    <Route path="/auth" element={<Auth />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <AuthDialog />
                </BrowserRouter>
              </TooltipProvider>
            </CounterProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
