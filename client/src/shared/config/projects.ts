export type ProjectCategory = "frontend" | "backend" | "design" | "api" | "fullstack";

export interface Project {
  id: string;
  titleRu: string;
  titleEn: string;
  categories: ProjectCategory[];
  descriptionRu: string;
  descriptionEn: string;
  image: string;
  url: string;
  technologies: string[];
  glowColor?: string;
}

export const categoryLabels: Record<ProjectCategory, { ru: string; en: string }> = {
  frontend: { ru: "Фронтенд", en: "Frontend" },
  backend: { ru: "Бэкенд", en: "Backend" },
  design: { ru: "Дизайн", en: "Design" },
  api: { ru: "API", en: "API" },
  fullstack: { ru: "Full-stack", en: "Full-stack" },
};

// TODO: Перенести в БД для редактирования через админку
export const projects: Project[] = [
  {
    id: "portfolio",
    titleRu: "Портфолио",
    titleEn: "Portfolio",
    categories: ["fullstack", "design"],
    descriptionRu: "Персональный сайт-портфолио с Liquid Glass UI, адаптивным дизайном и поддержкой темной темы.",
    descriptionEn: "Personal portfolio website with Liquid Glass UI, responsive design and dark theme support.",
    image: "/portfolio.jpg",
    url: "https://kyureno.dev",
    technologies: ["Next.js", "TypeScript", "Tailwind", "Go", "PostgreSQL"],
    glowColor: "#3178C6",
  },
  {
    id: "oll",
    titleRu: "OsuServerLauncher",
    titleEn: "OsuServerLauncher",
    categories: ["frontend", "design"],
    descriptionRu: "Современный лаунчер для приватных серверов osu! с управлением серверами, темами и мультиязычностью.",
    descriptionEn: "Modern launcher for osu! private servers with server management, themes and multilingual support.",
    image: "/OLL.jpg",
    url: "https://github.com/Kyureno2374/OsuServerLauncher",
    technologies: ["Electron", "React", "TypeScript", "Tailwind", "Vite"],
    glowColor: "#FF66AA",
  },
];
