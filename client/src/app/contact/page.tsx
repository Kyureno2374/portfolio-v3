"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaTelegram, FaDiscord, FaGithub } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { GridBackground } from "@/shared/ui/grid-background";

const pageContent = {
  ru: {
    title: "Связь",
    description: "Чаще всего и быстрее всего отвечаю в соц сетях, которые оставил ниже. Если долго не отвечаю — лучше продублировать.",
  },
  en: {
    title: "Contact",
    description: "I respond fastest on social media listed below. If I don't reply for a while — feel free to ping me again.",
  },
};

const contacts = [
  {
    id: "telegram",
    name: "Telegram",
    value: "@kyurenodev",
    url: "https://t.me/kyurenodev",
    icon: FaTelegram,
    color: "#26A5E4",
  },
  {
    id: "discord",
    name: "Discord",
    value: "kyureno",
    url: "https://discord.com/users/kyureno",
    icon: FaDiscord,
    color: "#5865F2",
  },
  {
    id: "github",
    name: "GitHub",
    value: "Kyureno2374",
    url: "https://github.com/Kyureno2374",
    icon: FaGithub,
    color: "#808080",
  },
];

export default function ContactPage() {
  const { language } = useLanguage();
  const content = pageContent[language];

  return (
    <>
      <GridBackground />

      {/* Контент */}
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full text-center"
        >
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaEnvelope className="w-7 h-7 text-primary dark:text-dark-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-dark-primary">
                {content.title}
              </h1>
            </div>
            <p className="text-base md:text-lg text-secondary dark:text-dark-secondary leading-relaxed">
              {content.description}
            </p>
          </motion.div>

          {/* Контакты */}
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <motion.a
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-black/10 dark:hover:border-white/10"
              >
                {/* Glow на hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    boxShadow: `0 0 30px -5px ${contact.color}30, inset 0 0 20px -10px ${contact.color}15`,
                  }}
                />

                {/* Иконка */}
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300"
                  style={{ backgroundColor: `${contact.color}15` }}
                >
                  <contact.icon
                    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: contact.color }}
                  />
                </div>

                {/* Инфо */}
                <div className="flex-1 text-left">
                  <div className="text-sm text-secondary dark:text-dark-secondary">
                    {contact.name}
                  </div>
                  <div className="text-base font-medium text-primary dark:text-dark-primary">
                    {contact.value}
                  </div>
                </div>

                {/* Стрелка */}
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: `${contact.color}20` }}
                >
                  <svg
                    className="w-4 h-4"
                    style={{ color: contact.color }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
