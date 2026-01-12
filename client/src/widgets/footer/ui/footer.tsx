"use client";

import Link from "next/link";
import { FaGithub, FaTelegram, FaDiscord, FaHeart, FaCog } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";

const socialLinks = [
  { icon: FaTelegram, href: "https://t.me/kyurenodev", label: "Telegram" },
  { icon: FaDiscord, href: "https://discord.com/users/kyureno", label: "Discord" },
  { icon: FaGithub, href: "https://github.com/Kyureno2374", label: "GitHub" },
];

export function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Левая часть */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-secondary dark:text-dark-secondary">
              © {currentYear} Kyureno. {language === "ru" ? "Все права защищены" : "All rights reserved"}.
            </p>
            <p className="text-xs text-secondary/60 dark:text-dark-secondary/60 flex items-center gap-1.5">
              {language === "ru" ? "Сделано с" : "Made with"}
              <FaHeart className="w-3 h-3 text-red-500" />
            </p>
          </div>

          {/* Центр - прикольная надпись */}
          <div className="text-center">
            <p className="text-xs text-secondary/50 dark:text-dark-secondary/50 uppercase tracking-widest">
              {language === "ru" 
                ? "Дизайн берите сколько влезет ребята, на всех хватит" 
                : "Feel free to take the design, there's enough for everyone"}
            </p>
          </div>

          {/* Соцсети + админка */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg
                    bg-black/5 dark:bg-white/5
                    hover:bg-black/10 dark:hover:bg-white/10
                    text-secondary dark:text-dark-secondary
                    hover:text-primary dark:hover:text-dark-primary
                    transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
            
            {/* Кнопка админки */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-[10px] text-secondary/40 dark:text-dark-secondary/40 
                hover:text-secondary/60 dark:hover:text-dark-secondary/60 transition-colors"
            >
              <FaCog className="w-3 h-3" />
              <span>{language === "ru" ? "Редактирование" : "Edit"}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
