"use client";

import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import { GridBackground } from "@/shared/ui/grid-background";

export default function AdminPage() {
  const { language } = useLanguage();

  return (
    <>
      <GridBackground />
      
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
          >
            <FaCheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <h1 className="text-2xl font-bold text-primary dark:text-dark-primary mb-2">
            {language === "ru" ? "Успешный вход!" : "Login successful!"}
          </h1>
          
          <p className="text-secondary dark:text-dark-secondary">
            {language === "ru" ? "Добро пожаловать в админку" : "Welcome to admin panel"}
          </p>
        </motion.div>
      </div>
    </>
  );
}
