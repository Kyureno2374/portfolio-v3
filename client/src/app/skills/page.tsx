"use client";

import { motion } from "framer-motion";
import { FaCode, FaGraduationCap } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { skillCategories } from "@/shared/config/skills";
import { SkillCard } from "@/shared/ui/skill-card";
import { GridBackground } from "@/shared/ui/grid-background";

const pageContent = {
  ru: {
    title: "Мои скиллы",
    description: "Создаю быстрые, надежные и масштабируемые веб-платформы. На фронтенде использую TypeScript, React и Next.js, на бэкенде — Go, Python и Node.js. Имею опыт работы с CI/CD, контейнеризацией и современными средами развертывания. Стремлюсь к эффективной и удобной в поддержке инфраструктуре.",
  },
  en: {
    title: "My Skills",
    description: "I build fast, reliable and scalable web platforms. On the frontend I use TypeScript, React and Next.js, on the backend — Go, Python and Node.js. I have experience with CI/CD, containerization and modern deployment environments. I strive for efficient and maintainable infrastructure.",
  },
};

export default function SkillsPage() {
  const { language } = useLanguage();
  const content = pageContent[language];

  return (
    <>
      <GridBackground />

      {/* Контент */}
      <div className="min-h-screen px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaCode className="w-8 h-8 text-primary dark:text-dark-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-dark-primary">
                {content.title}
              </h1>
            </div>
            <p className="text-base md:text-lg text-secondary dark:text-dark-secondary max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </motion.div>

          {/* Категории скиллов */}
          <div className="space-y-12">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: categoryIndex * 0.15,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {/* Заголовок категории */}
                <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-dark-primary mb-6 flex items-center gap-3">
                  {category.isLearning ? (
                    <>
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-500 to-emerald-500" />
                      <FaGraduationCap className="w-5 h-5 text-green-500" />
                    </>
                  ) : (
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                  )}
                  {language === "ru" ? category.titleRu : category.titleEn}
                  {category.isLearning && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium text-green-500 bg-green-500/10 rounded-full border border-green-500/20">
                      {language === "ru" ? "в процессе" : "in progress"}
                    </span>
                  )}
                </h2>

                {/* Сетка скиллов */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      index={skillIndex}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
