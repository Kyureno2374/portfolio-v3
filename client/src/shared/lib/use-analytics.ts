"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackSession } from "@/shared/api/analytics";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "desktop";
  
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function useAnalytics() {
  const pathname = usePathname();
  const startTime = useRef(Date.now());
  const pagesVisited = useRef<Set<string>>(new Set());

  useEffect(() => {
    const visitorId = getVisitorId();
    const device = getDeviceType();

    // Track page view
    trackPageView(pathname, visitorId, device);
    pagesVisited.current.add(pathname);

    // Track session on unload
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      const theme = localStorage.getItem("theme") || "light";
      const language = "ru"; // Default, could be from context
      
      // Use sendBeacon for reliable tracking on page unload
      const data = JSON.stringify({
        event: "session",
        visitor_id: visitorId,
        duration,
        pages: pagesVisited.current.size,
        theme,
        language,
      });
      
      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/analytics/track`,
        new Blob([data], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);
}
