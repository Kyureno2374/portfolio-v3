"use client";

import { motion } from "framer-motion";
import { FaGithub, FaTelegram, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";

export default function ContactPage() {
  const { language } = useLanguage();

  const contacts = [
    { icon: FaGithub, label: "GitHub", href: "https://github.com/Kyureno2374" },
    { icon: FaTelegram, label: "Telegram", href: "#" },
    { icon: FaEnvelope, label: "Email", href: "mailto:example@email.com" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {language === "ru" ? "Связь" : "Contact"}
        </h1>
        <div className="flex flex-wrap gap-4">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl
                bg-white/50 dark:bg-white/5 backdrop-blur-glass
                border border-black/10 dark:border-white/10
                hover:bg-black/5 dark:hover:bg-white/10
                transition-colors duration-300"
            >
              <contact.icon className="w-6 h-6" />
              <span className="font-medium">{contact.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
