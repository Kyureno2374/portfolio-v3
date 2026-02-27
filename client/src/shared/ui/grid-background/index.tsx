"use client";

import { useTheme } from "@/shared/lib/theme-context";
import { memo, useEffect, useState } from "react";

export const GridBackground = memo(function GridBackground() {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <>
      {/* Видео только для десктопа в темной теме */}
      {!isMobile && (
        <div className="fixed inset-0 -z-20" style={{ contain: "strict" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out will-change-opacity"
            style={{ opacity: theme === "dark" ? 1 : 0 }}
          >
            <source src="/grid.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Статичный фон для мобилок в темной теме (вместо видео) */}
      {isMobile && (
        <div
          className="fixed inset-0 -z-20 bg-dark-bg transition-opacity duration-700 ease-in-out"
          style={{
            opacity: theme === "dark" ? 1 : 0,
            contain: "strict",
          }}
        />
      )}

      {/* Статичный фон для светлой темы */}
      <div
        className="fixed inset-0 -z-20 bg-[#fafafa] transition-opacity duration-700 ease-in-out overflow-hidden"
        style={{
          opacity: theme === "light" ? 1 : 0,
          contain: "strict",
        }}
      >
        <div
          className="absolute rounded-full opacity-20"
          style={{
            background: "linear-gradient(135deg, #3178C6 0%, #61DAFB 100%)",
            top: "-10%",
            right: "-10%",
            width: isMobile ? "300px" : "600px",
            height: isMobile ? "300px" : "600px",
            filter: isMobile ? "blur(60px)" : "blur(120px)",
          }}
        />
        
        <div
          className="absolute rounded-full opacity-15"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
            bottom: "-5%",
            left: "-5%",
            width: isMobile ? "250px" : "500px",
            height: isMobile ? "250px" : "500px",
            filter: isMobile ? "blur(50px)" : "blur(100px)",
          }}
        />

        <div
          className="absolute rounded-full opacity-10"
          style={{
            background: "linear-gradient(135deg, #00ADD8 0%, #4FC08D 100%)",
            top: "40%",
            left: "30%",
            width: isMobile ? "200px" : "400px",
            height: isMobile ? "200px" : "400px",
            filter: isMobile ? "blur(40px)" : "blur(80px)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 50%, rgba(250,250,250,0.8) 100%)",
          }}
        />
      </div>

      {/* Оверлей для темной темы */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-b from-dark-bg/70 via-dark-bg/50 to-dark-bg/80 transition-opacity duration-700 ease-in-out"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />
    </>
  );
});
