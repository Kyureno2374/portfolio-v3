"use client";

import { ReactNode, useState, useEffect } from "react";
import { ThemeProvider } from "@/shared/lib/theme-context";
import { LanguageProvider } from "@/shared/lib/language-context";
import { useAnalytics } from "@/shared/lib/use-analytics";

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
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
        <AnalyticsTracker />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
