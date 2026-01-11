"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/shared/lib/language-context";

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          {language === "ru" ? "Привет" : "Hello"}
          <span className="text-secondary dark:text-dark-secondary">,</span>
        </h1>
        <p className="text-xl md:text-2xl text-secondary dark:text-dark-secondary mb-8">
          {language === "ru" 
            ? "Я разработчик" 
            : "I'm a developer"}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-block px-6 py-3 rounded-2xl
            bg-white/50 dark:bg-white/5 backdrop-blur-glass
            border border-black/10 dark:border-white/10
            text-sm text-secondary dark:text-dark-secondary italic"
        >
          {language === "ru" 
            ? "Используйте навигацию для просмотра разделов" 
            : "Use navigation to explore sections"}
        </motion.div>
      </motion.div>
    </div>
  );
}
