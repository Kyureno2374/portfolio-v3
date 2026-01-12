"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaCode, FaGraduationCap, FaRocket, FaCalendarAlt } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { ColoredText } from "@/shared/ui/colored-text";
import { GridBackground } from "@/shared/ui/grid-background";

const aboutContent = {
  ru: {
    title: "Обо мне",
    bio: `Я full-stack разработчик, в IT с 2021 года — уже более 4 лет в разработке. На фронтенде использую TypeScript, React, Next.js, Vue.js и Nuxt, стилизую через Tailwind и Sass. Бэкенды пишу на Go, Python и Node.js с Express и Fastify. Работаю с PostgreSQL, MongoDB, Redis. Также изучаю Rust и Java для расширения стека. Использую Docker, GitHub Actions, Nginx для CI/CD и деплоя. Учусь в РАНХиГС, дополнительно углубленно изучаю Data Engineering — Apache Spark, Kafka, Airflow и ClickHouse.`,
    stats: {
      experience: "4+ лет",
      experienceLabel: "в разработке",
      projects: "10+",
      projectsLabel: "проектов",
      stack: "40+",
      stackLabel: "технологий",
      education: "РАНХиГС",
      educationLabel: "обучение",
    },
  },
  en: {
    title: "About Me",
    bio: `I'm a full-stack developer, in IT since 2021 — over 4 years in development. On the frontend I use TypeScript, React, Next.js, Vue.js and Nuxt, styling with Tailwind and Sass. Backends are written in Go, Python and Node.js with Express and Fastify. I work with PostgreSQL, MongoDB, Redis. Also learning Rust and Java to expand my stack. Using Docker, GitHub Actions, Nginx for CI/CD and deployment. Studying at РАНХиГС, additionally deep diving into Data Engineering — Apache Spark, Kafka, Airflow and ClickHouse.`,
    stats: {
      experience: "4+ years",
      experienceLabel: "in development",
      projects: "10+",
      projectsLabel: "projects",
      stack: "40+",
      stackLabel: "technologies",
      education: "РАНХиГС",
      educationLabel: "studying",
    },
  },
};

const statIcons = [FaCalendarAlt, FaRocket, FaCode, FaGraduationCap];
const statColors = ["#3178C6", "#8B5CF6", "#00ADD8", "#10B981"];

export default function HomePage() {
  const { language } = useLanguage();
  const content = aboutContent[language];
  const stats = [
    { value: content.stats.experience, label: content.stats.experienceLabel },
    { value: content.stats.projects, label: content.stats.projectsLabel },
    { value: content.stats.stack, label: content.stats.stackLabel },
    { value: content.stats.education, label: content.stats.educationLabel },
  ];

  return (
    <>
      <GridBackground />

      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl w-full"
        >
          {/* Верхняя часть с фото и заголовком */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col md:flex-row items-center gap-6 mb-10"
          >
            {/* Фото */}
            <motion.div
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 ring-blue-600 shadow-xl shadow-blue-600/30"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/logo.png"
                alt="Kyureno"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>

            {/* Заголовок и подзаголовок */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-dark-primary mb-1">
                {language === "ru" ? "Георгий" : "Georgy"}
              </h1>
              <p className="text-lg text-secondary dark:text-dark-secondary mb-1">
                @Kyureno
              </p>
              <p className="text-sm text-secondary/70 dark:text-dark-secondary/70">
                Full-stack {language === "ru" ? "разработчик" : "developer"}
              </p>
            </div>
          </motion.div>

          {/* Статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {stats.map((stat, index) => {
              const Icon = statIcons[index];
              const color = statColors[index];
              return (
                <motion.div
                  key={stat.label}
                  className="relative p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-center group"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{ boxShadow: `0 0 30px -10px ${color}40` }}
                  />
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                  <div className="text-xl md:text-2xl font-bold text-primary dark:text-dark-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-secondary dark:text-dark-secondary">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Био */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="p-6 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5"
          >
            <div className="text-base md:text-lg leading-relaxed text-secondary dark:text-dark-secondary">
              <ColoredText text={content.bio} />
            </div>
          </motion.div>

          {/* Декоративные элементы */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
            <span className="text-xs text-secondary/50 dark:text-dark-secondary/50">
              {language === "ru" ? "открыт к сотрудничеству" : "open to collaboration"}
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
