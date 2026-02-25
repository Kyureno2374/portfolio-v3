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
    image: "/oll.jpg",
    url: "https://github.com/Kyureno2374/OsuServerLauncher",
    technologies: ["Electron", "React", "TypeScript", "Tailwind", "Vite"],
    glowColor: "#FF66AA",
  },
  {
    id: "neon-mu",
    titleRu: "NEON MuOnline",
    titleEn: "NEON MuOnline",
    categories: ["fullstack", "design"],
    descriptionRu: "Полноценная платформа для приватного сервера MuOnline: фронтенд, бэкенд, админ-панель и лендинг сайт.",
    descriptionEn: "Complete platform for MuOnline private server: frontend, backend, admin panel and landing website.",
    image: "/neon-mu.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    glowColor: "#00FF88",
  },
  {
    id: "investment-platform",
    titleRu: "Microservice Investment Platform",
    titleEn: "Microservice Investment Platform",
    categories: ["backend", "api"],
    descriptionRu: "Микросервисная инвестиционная платформа с RabbitMQ, Redis и полной контейнеризацией.",
    descriptionEn: "Microservice investment platform with RabbitMQ, Redis and full containerization.",
    image: "/investment-platform.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["Java 17", "Spring Boot", "RabbitMQ", "Redis", "MySQL", "Docker"],
    glowColor: "#FF6B35",
  },
  {
    id: "payment-gateway",
    titleRu: "Payment Gateway Simulator",
    titleEn: "Payment Gateway Simulator",
    categories: ["backend", "api"],
    descriptionRu: "REST API для эмуляции платежных операций с валидацией, Kafka и асинхронной обработкой событий.",
    descriptionEn: "REST API for payment operations simulation with validation, Kafka and async event processing.",
    image: "/payment-gateway.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Docker", "JUnit"],
    glowColor: "#4ECDC4",
  },
  {
    id: "yamusic-plus",
    titleRu: "YaMusic Plus [Архив]",
    titleEn: "YaMusic Plus [Archived]",
    categories: ["frontend"],
    descriptionRu: "Модификации для ПК-версии Яндекс Музыки, расширяющие возможности плеера. Проект заброшен.",
    descriptionEn: "Modifications for Yandex Music desktop app that extend player capabilities. Project archived.",
    image: "/yamusic-plus.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["TypeScript", "Electron", "Node.js"],
    glowColor: "#FFD700",
  },
  {
    id: "analytics-platform",
    titleRu: "Real-Time Analytics Platform",
    titleEn: "Real-Time Analytics Platform",
    categories: ["backend", "api"],
    descriptionRu: "Микросервисная платформа аналитики в реальном времени на Go с Kafka, gRPC, Prometheus и Grafana.",
    descriptionEn: "Real-time analytics microservice platform built with Go, Kafka, gRPC, Prometheus and Grafana.",
    image: "/analytics-platform.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["Go", "Kafka", "gRPC", "Prometheus", "Grafana", "Docker"],
    glowColor: "#00D4FF",
  },
  {
    id: "tictactoe",
    titleRu: "TicTacToe Real Money",
    titleEn: "TicTacToe Real Money",
    categories: ["fullstack", "design"],
    descriptionRu: "Игра в крестики-нолики на реальные деньги с современным дизайном, платежной системой и мультиплеером.",
    descriptionEn: "Tic-tac-toe game for real money with modern design, payment system and multiplayer.",
    image: "/tictactoe.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "WebSocket"],
    glowColor: "#9B59B6",
  },
  {
    id: "spa-website",
    titleRu: "SPA Website",
    titleEn: "SPA Website",
    categories: ["frontend", "design"],
    descriptionRu: "Современный SPA-сайт с адаптивным дизайном, темной темой и компонентами Shadcn/ui.",
    descriptionEn: "Modern SPA website with responsive design, dark theme and Shadcn/ui components.",
    image: "/spa-website.jpg",
    url: "#", // TODO: Вставить ссылку на проект
    technologies: ["Next.js 14", "React", "TypeScript", "Shadcn/ui", "Tailwind"],
    glowColor: "#8B5CF6",
  },
];
