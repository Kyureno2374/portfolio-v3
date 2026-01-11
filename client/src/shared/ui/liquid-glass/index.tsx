"use client";

import { ReactNode, useState, useRef } from "react";
import { motion } from "framer-motion";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  displacementScale?: number;
  blurAmount?: number;
  elasticity?: number;
  cornerRadius?: number;
  isInteractive?: boolean;
}

export function LiquidGlass({
  children,
  className = "",
  displacementScale = 2.0,
  blurAmount = 1.5,
  elasticity = 0.7,
  cornerRadius = 16,
  isInteractive = true,
}: LiquidGlassProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = 
    typeof window !== "undefined" && 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive || prefersReducedMotion || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const currentBlur = prefersReducedMotion 
    ? blurAmount * 0.5 
    : isHovered 
      ? blurAmount * 1.2 
      : blurAmount;

  const gradientX = mousePosition.x * 100;
  const gradientY = mousePosition.y * 100;

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ borderRadius: cornerRadius }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={handleMouseMove}
      initial={false}
      animate={{
        scale: isHovered && isInteractive && !prefersReducedMotion ? 1.01 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
    >
      {/* Основной backdrop blur */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: `blur(${currentBlur * 10}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${currentBlur * 10}px) saturate(180%)`,
          borderRadius: cornerRadius,
          transition: "backdrop-filter 0.4s ease",
        }}
      />

      {/* Градиент преломления света - симметричный */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.06) 25%,
              rgba(255, 255, 255, 0.03) 50%,
              rgba(255, 255, 255, 0.06) 75%,
              rgba(255, 255, 255, 0.08) 100%
            )
          `,
          borderRadius: cornerRadius,
        }}
      />

      {/* Интерактивное свечение от курсора */}
      {isInteractive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              600px circle at ${gradientX}% ${gradientY}%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 40%
            )`,
            borderRadius: cornerRadius,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Граница и тени */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: cornerRadius,
          boxShadow: `
            inset 0 0.5px 0 rgba(255, 255, 255, 0.15),
            inset 0 -0.5px 0 rgba(0, 0, 0, 0.05),
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04)
          `,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transition: "box-shadow 0.4s ease",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
