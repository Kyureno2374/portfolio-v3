"use client";

import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/shared/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center
        hover:bg-white/10 dark:hover:bg-white/5
        rounded-xl transition-colors duration-300 overflow-hidden"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="relative w-6 h-6">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: theme === "light" ? 0 : 180,
            opacity: theme === "light" ? 1 : 0,
            scale: theme === "light" ? 1 : 0.5,
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <FaSun className="w-6 h-6 text-primary dark:text-dark-primary" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: theme === "dark" ? 0 : -180,
            opacity: theme === "dark" ? 1 : 0,
            scale: theme === "dark" ? 1 : 0.5,
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <FaMoon className="w-5 h-5 text-primary dark:text-dark-primary" />
        </motion.div>
      </div>
    </motion.button>
  );
}
