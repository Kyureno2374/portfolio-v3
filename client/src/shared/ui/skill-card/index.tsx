"use client";

import { motion } from "framer-motion";
import { Skill } from "@/shared/config/skills";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import { IconType } from "react-icons";

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const iconMap: Record<string, IconType> = {
  ...SiIcons,
  ...FaIcons,
};

export function SkillCard({ skill, index }: SkillCardProps) {
  const Icon = iconMap[skill.icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.03,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="group relative"
    >
      <div
        className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 dark:border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 dark:hover:border-white/10"
        style={{
          boxShadow: `0 0 0 1px transparent`,
        }}
      >
        {/* Glow на hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            boxShadow: `0 0 20px -5px ${skill.color}40, inset 0 0 20px -10px ${skill.color}20`,
          }}
        />

        {/* Иконка */}
        <div
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300"
          style={{
            backgroundColor: `${skill.color}15`,
          }}
        >
          {Icon && (
            <Icon
              className="w-4 h-4 transition-all duration-300 group-hover:scale-110"
              style={{ color: skill.color }}
            />
          )}
        </div>

        {/* Название */}
        <span className="text-sm font-medium text-primary/80 dark:text-dark-primary/80 group-hover:text-primary dark:group-hover:text-dark-primary transition-colors">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
}
