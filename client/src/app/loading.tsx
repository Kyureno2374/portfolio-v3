"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Логотип с пульсацией */}
        <motion.div
          className="relative w-20 h-20"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 blur-xl" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">K</span>
          </div>
        </motion.div>

        {/* Спиннер */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 border-4 border-blue-500/20 rounded-full"
          />
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Текст */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-secondary dark:text-dark-secondary"
        >
          Загрузка...
        </motion.p>

        {/* Точки */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
