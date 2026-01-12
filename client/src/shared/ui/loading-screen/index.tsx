"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Инициализация...");

  useEffect(() => {
    const assets = [
      { name: "Загрузка шрифтов...", weight: 15 },
      { name: "Загрузка стилей...", weight: 20 },
      { name: "Загрузка изображений...", weight: 25 },
      { name: "Загрузка видео...", weight: 25 },
      { name: "Подготовка интерфейса...", weight: 15 },
    ];

    let currentProgress = 0;
    let assetIndex = 0;

    const interval = setInterval(() => {
      if (assetIndex < assets.length) {
        const asset = assets[assetIndex];
        setLoadingText(asset.name);
        currentProgress += asset.weight;
        setProgress(Math.min(currentProgress, 100));
        assetIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background dark:bg-dark-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Лого анимация */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-600/20">
          <motion.span
            className="text-3xl font-bold text-white"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            K
          </motion.span>
        </div>
      </motion.div>

      {/* Прогресс бар */}
      <div className="w-64 mb-4">
        <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Текст загрузки */}
      <motion.p
        className="text-sm text-secondary dark:text-dark-secondary"
        key={loadingText}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {loadingText}
      </motion.p>

      {/* Процент */}
      <p className="text-xs text-secondary/50 dark:text-dark-secondary/50 mt-2">
        {progress}%
      </p>
    </motion.div>
  );
}
