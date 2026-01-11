"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/shared/lib/theme-context";
import { LanguageProvider } from "@/shared/lib/language-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
