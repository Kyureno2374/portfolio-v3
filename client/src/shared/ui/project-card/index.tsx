"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Project, categoryLabels } from "@/shared/config/projects";
import { useLanguage } from "@/shared/lib/language-context";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { language } = useLanguage();
  
  const title = language === "ru" ? project.titleRu : project.titleEn;
  const description = language === "ru" ? project.descriptionRu : project.descriptionEn;
  const glowColor = project.glowColor || "#8B5CF6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      <Link href={project.url} target="_blank" rel="noopener noreferrer">
        <motion.div
          className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden group cursor-pointer bg-black/40"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            boxShadow: `0 4px 20px -5px ${glowColor}15`,
          }}
        >
          {/* Glow на hover */}
          <div
            className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ 
              background: `linear-gradient(135deg, ${glowColor}20 0%, transparent 50%, ${glowColor}10 100%)`,
            }}
          />

          {/* Фоновое изображение */}
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={title}
              fill
              className="object-cover object-top transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-40 opacity-30"
            />
          </div>

          {/* Градиент */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/90" />

          {/* Декоративная линия */}
          <div 
            className="absolute top-0 left-0 w-1 h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: glowColor }}
          />

          {/* Контент */}
          <div className="relative h-full p-5 md:p-6 flex flex-col justify-between z-10">
            {/* Верх: категории */}
            <div className="flex flex-wrap gap-1.5">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded"
                  style={{ 
                    backgroundColor: `${glowColor}20`,
                    color: glowColor,
                  }}
                >
                  {categoryLabels[cat][language]}
                </span>
              ))}
            </div>

            {/* Низ: инфо */}
            <div>
              {/* Название */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-white/95 transition-colors">
                {title}
              </h3>

              {/* Описание */}
              <p className="text-xs md:text-sm text-white/50 mb-4 line-clamp-2 leading-relaxed">
                {description}
              </p>

              {/* Технологии + кнопка */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-medium text-white/60 bg-white/5 rounded border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <motion.div 
                  className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <span className="text-xs font-medium hidden sm:block">
                    {language === "ru" ? "Открыть" : "Open"}
                  </span>
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${glowColor}25`,
                    }}
                  >
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
