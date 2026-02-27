"use client";

import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "@/shared/lib/theme-context";
import { LanguageProvider } from "@/shared/lib/language-context";
import { useAnalytics } from "@/shared/lib/use-analytics";
import { PageLoader } from "@/shared/ui/page-loader";
import { YandexMetrika } from "@/shared/lib/yandex-metrika";
import { GoogleAnalytics } from "@/shared/lib/google-analytics";

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
        <Suspense fallback={null}>
          <YandexMetrika />
          <GoogleAnalytics />
        </Suspense>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
