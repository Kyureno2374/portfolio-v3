"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Загрузка...");

  useEffect(() => {
    const steps = [
      { text: "Загрузка стилей...", target: 30 },
      { text: "Подготовка контента...", target: 60 },
      { text: "Почти готово...", target: 90 },
      { text: "Готово!", target: 100 },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingText(steps[stepIndex].text);
        setProgress(steps[stepIndex].target);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-dark-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-64 mb-4">
        <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <p className="text-sm text-secondary dark:text-dark-secondary">{loadingText}</p>
      <p className="text-xs text-secondary/50 dark:text-dark-secondary/50 mt-1">{progress}%</p>
    </motion.div>
  );
}
