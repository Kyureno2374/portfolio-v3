"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/shared/lib/theme-context";
import { LanguageProvider } from "@/shared/lib/language-context";
import { useAnalytics } from "@/shared/lib/use-analytics";
import { PageLoader } from "@/shared/ui/page-loader";

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PageLoader />
        <AnalyticsTracker />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
