"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackSessionEnd } from "./analytics";

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Трекаем просмотр страницы
    trackPageView(pathname);

    // Трекаем уход со страницы
    const handleBeforeUnload = () => {
      trackSessionEnd();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);
}
