"use client";

import { useTheme } from "@/shared/lib/theme-context";
import { memo } from "react";

export const GridBackground = memo(function GridBackground() {
  const { theme } = useTheme();

  return (
    <>
      {/* Видео для темной темы */}
      <div className="fixed inset-0 -z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out will-change-opacity"
          style={{ opacity: theme === "dark" ? 1 : 0 }}
        >
          <source src="/grid.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Статичный фон для светлой темы - без анимаций для производительности */}
      <div
        className="fixed inset-0 -z-20 bg-[#fafafa] transition-opacity duration-700 ease-in-out overflow-hidden"
        style={{ opacity: theme === "light" ? 1 : 0 }}
      >
        {/* Градиентные пятна - статичные */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "linear-gradient(135deg, #3178C6 0%, #61DAFB 100%)",
            top: "-10%",
            right: "-10%",
          }}
        />
        
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
            bottom: "-5%",
            left: "-5%",
          }}
        />

        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: "linear-gradient(135deg, #00ADD8 0%, #4FC08D 100%)",
            top: "40%",
            left: "30%",
          }}
        />

        {/* Тонкая сетка */}
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

        {/* Виньетка */}
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
