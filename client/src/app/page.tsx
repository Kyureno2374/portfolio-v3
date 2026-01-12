"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/shared/lib/language-context";
import { useTheme } from "@/shared/lib/theme-context";

export default function HomePage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <>
      {/* Видео фон - фиксированный на весь экран */}
      <div className="fixed inset-0 -z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: theme === "dark" ? 1 : 0 }}
        >
          <source src="/grid.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Фон для светлой темы */}
      <div 
        className="fixed inset-0 -z-20 bg-background transition-opacity duration-700 ease-in-out"
        style={{ opacity: theme === "light" ? 1 : 0 }}
      />

      {/* Градиентный оверлей для темной темы */}
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-b from-dark-bg/70 via-dark-bg/50 to-dark-bg/80 transition-opacity duration-700 ease-in-out"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />

      {/* Контент */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center flex flex-col items-center"
        >
          {/* Лого */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-6"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-white/20 dark:ring-white/10 shadow-xl">
              <Image
                src="/logo.png"
                alt="Kyureno"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="text-primary dark:text-dark-primary">
              {language === "ru" ? "Привет, я" : "Hi, I'm"}{" "}
            </span>
            <span className="text-secondary dark:text-white">Kyureno</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-4 text-xl sm:text-2xl md:text-3xl text-secondary dark:text-dark-secondary"
          >
            Full-stack {language === "ru" ? "разработчик" : "developer"}
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
