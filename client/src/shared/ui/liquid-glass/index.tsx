"use client";

import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) setIsMobile(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive || isMobile || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, [isInteractive, isMobile]);

  const mobileBlur = Math.min(blurAmount * 6, 10);
  const desktopBlur = isHovered ? blurAmount * 12 : blurAmount * 10;
  const currentBlur = isMobile ? mobileBlur : desktopBlur;

  const gradientX = mousePosition.x * 100;
  const gradientY = mousePosition.y * 100;

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ borderRadius: cornerRadius, contain: "layout style" }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={handleMouseMove}
      initial={false}
      animate={{
        scale: isHovered && isInteractive && !isMobile ? 1.01 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: `blur(${currentBlur}px) saturate(${isMobile ? 140 : 180}%)`,
          WebkitBackdropFilter: `blur(${currentBlur}px) saturate(${isMobile ? 140 : 180}%)`,
          borderRadius: cornerRadius,
          transition: isMobile ? "none" : "backdrop-filter 0.4s ease",
        }}
      />

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

      {/* Интерактивное свечение — только на десктопе */}
      {isInteractive && !isMobile && (
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: cornerRadius,
          boxShadow: isMobile
            ? `inset 0 0.5px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06)`
            : `
              inset 0 0.5px 0 rgba(255, 255, 255, 0.15),
              inset 0 -0.5px 0 rgba(0, 0, 0, 0.05),
              0 8px 32px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04)
            `,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transition: isMobile ? "none" : "box-shadow 0.4s ease",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
