"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { ThemeToggle } from "@/features/theme-toggle";
import { LanguageSwitcher } from "@/features/language-switcher";
import { MusicPlayer } from "@/features/music-player";
import { NavItem } from "@/entities/navigation";
import { navigationItems } from "@/shared/config";
import { LiquidGlass } from "@/shared/ui/liquid-glass";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="mx-auto max-w-5xl"
      >
        <div className="relative" style={{ overflow: "visible" }}>
          <LiquidGlass
            displacementScale={1.5}
            blurAmount={2.0}
            elasticity={0.8}
            cornerRadius={20}
            isInteractive={false}
            className="bg-white/5 dark:bg-white/[0.02]"
          >
            <div className="px-4 py-2.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="w-10 h-10 rounded-xl overflow-hidden
                        ring-1 ring-white/20 dark:ring-white/10
                        shadow-lg shadow-black/5"
                    >
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </motion.div>
                  </Link>

                  <nav className="hidden lg:flex items-center">
                    <LiquidGlass
                      displacementScale={1.0}
                      blurAmount={1.0}
                      elasticity={0.6}
                      cornerRadius={14}
                      isInteractive={false}
                      className="bg-white/[0.03] dark:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-0.5 px-1.5 py-1">
                        {navigationItems.map((item) => (
                          <NavItem key={item.id} item={item} showLabel={true} />
                        ))}
                      </div>
                    </LiquidGlass>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MusicPlayer />
                    <ThemeToggle />
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Link
                        href="https://github.com/Kyureno2374"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center
                          hover:bg-white/10 dark:hover:bg-white/5
                          rounded-xl transition-colors duration-300"
                      >
                        <FaGithub className="w-6 h-6 text-primary dark:text-dark-primary" />
                      </Link>
                    </motion.div>
                  </div>

                  <div className="hidden sm:block">
                    <LanguageSwitcher />
                  </div>

                  <motion.button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden w-10 h-10 flex items-center justify-center
                      hover:bg-white/10 dark:hover:bg-white/5
                      rounded-xl transition-colors duration-300"
                    aria-label="Toggle menu"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <AnimatePresence mode="wait">
                      {mobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                          <FaTimes className="w-5 h-5 text-primary dark:text-dark-primary" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                          <FaBars className="w-5 h-5 text-primary dark:text-dark-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>
          </LiquidGlass>

          {/* Мобильное меню - вынесено за пределы LiquidGlass */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="lg:hidden absolute left-0 right-0 top-full mt-2"
                style={{ zIndex: 9998 }}
              >
                <LiquidGlass
                  displacementScale={1.5}
                  blurAmount={2.0}
                  elasticity={0.8}
                  cornerRadius={16}
                  isInteractive={false}
                  className="bg-white/10 dark:bg-black/30"
                >
                  <nav className="p-3 flex flex-col gap-1">
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.05,
                          duration: 0.25,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <NavItem item={item} showLabel={true} />
                      </motion.div>
                    ))}
                    <motion.div 
                      className="sm:hidden pt-2 mt-2 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <LanguageSwitcher />
                    </motion.div>
                  </nav>
                </LiquidGlass>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  );
}
