"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/shared/lib/language-context";
import { useTheme } from "@/shared/lib/theme-context";
import { ColoredText } from "@/shared/ui/colored-text";

// TODO: Перенести в БД для редактирования через админку
const aboutContent = {
  ru: {
    title: "Обо мне",
    bio: `Я full-stack разработчик, специализирующийся на создании быстрых и надежных веб-платформ. На фронтенде использую TypeScript, React и Next.js, а бэкенды пишу на Go, Python и TypeScript с Node.js. Также изучаю Rust и Java для расширения стека. Параллельно учусь в РАНХиГС. Большинство моих проектов связаны с веб-разработкой, где особенно важны производительность, безопасность и масштабируемость.`,
  },
  en: {
    title: "About Me",
    bio: `I'm a full-stack developer specializing in building fast and reliable web platforms. On the frontend I use TypeScript, React and Next.js, while backends are written in Go, Python and TypeScript with Node.js. Also learning Rust and Java to expand my stack. Currently studying at РАНХиГС. Most of my projects are related to web development, where performance, security and scalability are especially important.`,
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const content = aboutContent[language];

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
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full text-center flex flex-col items-center"
        >
          {/* Заголовок */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-5xl font-bold mb-8 text-primary dark:text-dark-primary"
          >
            {content.title}
          </motion.h1>

          {/* Био */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-lg md:text-xl leading-relaxed text-secondary dark:text-dark-secondary"
          >
            <ColoredText text={content.bio} />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
