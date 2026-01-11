"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/shared/lib/language-context";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {language === "ru" ? "Обо мне" : "About Me"}
        </h1>
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-glass
          border border-black/10 dark:border-white/10">
          <p className="text-lg text-secondary dark:text-dark-secondary leading-relaxed">
            {language === "ru" 
              ? "Здесь будет информация обо мне. Расскажите о своем опыте, образовании и интересах."
              : "Information about me will be here. Tell about your experience, education and interests."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
