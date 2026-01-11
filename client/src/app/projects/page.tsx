"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/shared/lib/language-context";

export default function ProjectsPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {language === "ru" ? "Проекты" : "Projects"}
        </h1>
        <div className="grid gap-4">
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-glass
            border border-black/10 dark:border-white/10">
            <h3 className="text-xl font-bold mb-2">
              {language === "ru" ? "Проект 1" : "Project 1"}
            </h3>
            <p className="text-secondary dark:text-dark-secondary">
              {language === "ru" 
                ? "Описание проекта будет здесь."
                : "Project description will be here."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
