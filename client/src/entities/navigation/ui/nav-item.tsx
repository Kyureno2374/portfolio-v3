"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaFolder, FaCode, FaEnvelope } from "react-icons/fa";
import { NavItem as NavItemType } from "@/shared/config";
import { useLanguage } from "@/shared/lib/language-context";

const iconMap = {
  folder: FaFolder,
  code: FaCode,
  envelope: FaEnvelope,
};

interface NavItemProps {
  item: NavItemType;
  showLabel?: boolean;
}

export function NavItem({ item, showLabel = true }: NavItemProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isActive = pathname === item.href;
  const Icon = iconMap[item.icon];
  const label = language === "ru" ? item.labelRu : item.labelEn;

  return (
    <Link href={item.href} className="relative block">
      <motion.div
        className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium
          transition-colors duration-300
          ${isActive 
            ? "text-primary dark:text-dark-primary" 
            : "text-secondary dark:text-dark-secondary"}`}
        whileHover="hover"
        initial="initial"
        animate={isActive ? "active" : "initial"}
      >
        {/* Фоновая подсветка */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-white/15 dark:bg-white/10"
          variants={{
            initial: { opacity: 0, scale: 0.95 },
            hover: { opacity: 1, scale: 1 },
            active: { opacity: 1, scale: 1 },
          }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        />
        
        {/* Свечение при активном состоянии */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
            }}
            layoutId="nav-glow"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        
        {/* Иконка */}
        <motion.div
          className="relative z-10"
          variants={{
            initial: { scale: 1, y: 0 },
            hover: { scale: 1.1, y: -1 },
            active: { scale: 1.05, y: 0 },
          }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
        
        {/* Текст */}
        {showLabel && (
          <motion.span
            className="relative z-10"
            variants={{
              initial: { opacity: 0.8 },
              hover: { opacity: 1 },
              active: { opacity: 1 },
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
}
