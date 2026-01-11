"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/shared/lib/language-context";

export default function SkillsPage() {
  const { language } = useLanguage();

  const skills = ["TypeScript", "React", "Next.js", "Go", "PostgreSQL", "Tailwind CSS"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {language === "ru" ? "Скиллы" : "Skills"}
        </h1>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-glass
                border border-black/10 dark:border-white/10 font-medium"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
