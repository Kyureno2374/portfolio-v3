"use client";

import { ReactNode, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/shared/lib/theme-context";
import { LanguageProvider } from "@/shared/lib/language-context";
import { LoadingScreen } from "@/shared/ui/loading-screen";

export function Providers({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>
        
        <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}>
          {children}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
