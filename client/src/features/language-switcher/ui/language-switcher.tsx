"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { LiquidGlass } from "@/shared/ui/liquid-glass";

const languages = [
  { code: "ru" as const, label: "Русский", flag: "/RU.png", short: "RU" },
  { code: "en" as const, label: "English", flag: "/US.png", short: "EN" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" style={{ zIndex: 9999 }}>
      <LiquidGlass
        displacementScale={1.5}
        blurAmount={1.5}
        elasticity={0.7}
        cornerRadius={12}
        className="bg-white/[0.03] dark:bg-white/[0.02]"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
        >
          <div className="w-[28px] h-[20px] rounded overflow-hidden ring-1 ring-white/20 flex-shrink-0">
            <Image
              src={currentLang.flag}
              alt={currentLang.label}
              width={28}
              height={20}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-primary dark:text-dark-primary">{currentLang.short}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <FaChevronDown className="w-3 h-3 text-secondary dark:text-dark-secondary" />
          </motion.div>
        </button>
      </LiquidGlass>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 min-w-[160px]"
          >
            <LiquidGlass
              displacementScale={2.0}
              blurAmount={2.5}
              elasticity={0.8}
              cornerRadius={14}
              isInteractive={false}
              className="bg-white/10 dark:bg-black/30"
            >
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5
                      hover:bg-white/15 dark:hover:bg-white/10
                      transition-colors duration-200
                      ${language === lang.code 
                        ? "bg-white/10 dark:bg-white/5 text-primary dark:text-dark-primary" 
                        : "text-secondary dark:text-dark-secondary"}`}
                  >
                    <div className="w-[28px] h-[20px] rounded overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                      <Image
                        src={lang.flag}
                        alt={lang.label}
                        width={28}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{lang.label}</span>
                  </button>
                ))}
              </div>
            </LiquidGlass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
