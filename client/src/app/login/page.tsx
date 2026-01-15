"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { GridBackground } from "@/shared/ui/grid-background";

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("admin_password", password);
        router.push("/admin");
      } else {
        setError(language === "ru" ? "Неверный пароль" : "Wrong password");
      }
    } catch {
      setError(language === "ru" ? "Ошибка сервера" : "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GridBackground />
      
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <FaLock className="w-6 h-6 text-secondary dark:text-dark-secondary" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-center text-primary dark:text-dark-primary mb-2">
              {language === "ru" ? "Вход в админку" : "Admin Login"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "ru" ? "Пароль" : "Password"}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-black/5 dark:bg-white/5 
                    border border-black/10 dark:border-white/10
                    text-primary dark:text-dark-primary placeholder:text-secondary/50
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary dark:text-dark-secondary"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black 
                  font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading 
                  ? (language === "ru" ? "Проверка..." : "Checking...") 
                  : (language === "ru" ? "Войти" : "Login")}
              </button>
            </form>
          </div>

          {/* Прикольная надпись */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-secondary/50 dark:text-dark-secondary/50 mt-4 leading-relaxed"
          >
            {language === "ru" 
              ? "НУ ТЫ ЖЕ НЕ ПОДБЕРЕШЬ ПАРОЛЬ ОТ АДМИНКИ ЧЕ ЗАШЕЛ СЮДА ЫХПХЫВХАЫ))" 
              : "YOU WON'T GUESS THE ADMIN PASSWORD WHY ARE YOU EVEN HERE LMAO))"}
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
