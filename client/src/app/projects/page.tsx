"use client";

import { motion } from "framer-motion";
import { FaFolderOpen } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { useTheme } from "@/shared/lib/theme-context";
import { projects } from "@/shared/config/projects";
import { ProjectCard } from "@/shared/ui/project-card";

// TODO: Перенести в БД для редактирования через админку
const pageContent = {
  ru: {
    title: "Мои проекты",
    description: "Здесь собраны мои работы: веб-приложения, фронтенд-решения и UI-дизайн. Стремлюсь создавать чистый, производительный и интуитивно понятный интерфейс. Часть проектов выполнена на заказ, другие — для практики и изучения новых технологий. Параллельно развиваю собственные идеи.",
  },
  en: {
    title: "My Projects",
    description: "Here are my works: web applications, frontend solutions and UI design. I strive to create clean, performant and intuitive interfaces. Some projects are commissioned, others are for practice and learning new technologies. I'm also developing my own ideas in parallel.",
  },
};

export default function ProjectsPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const content = pageContent[language];

  return (
    <>
      {/* Видео фон */}
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

      <div 
        className="fixed inset-0 -z-20 bg-background transition-opacity duration-700 ease-in-out"
        style={{ opacity: theme === "light" ? 1 : 0 }}
      />

      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-b from-dark-bg/70 via-dark-bg/50 to-dark-bg/80 transition-opacity duration-700 ease-in-out"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />

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
              <FaFolderOpen className="w-8 h-8 text-primary dark:text-dark-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-dark-primary">
                {content.title}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-secondary dark:text-dark-secondary max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </motion.div>

          {/* Сетка проектов */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
