export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface SkillCategory {
  id: string;
  titleRu: string;
  titleEn: string;
  skills: Skill[];
  isLearning?: boolean;
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    titleRu: "Фронтенд",
    titleEn: "Frontend",
    skills: [
      { name: "TypeScript", icon: "SiTypescript", color: "#3178C6" },
      { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E" },
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#808080" },
      { name: "Vue.js", icon: "SiVuedotjs", color: "#4FC08D" },
      { name: "Nuxt", icon: "SiNuxtdotjs", color: "#00DC82" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4" },
      { name: "Sass", icon: "SiSass", color: "#CC6699" },
      { name: "Framer Motion", icon: "SiFramer", color: "#0055FF" },
      { name: "Redux", icon: "SiRedux", color: "#764ABC" },
      { name: "Zustand", icon: "SiReact", color: "#443E38" },
      { name: "React Query", icon: "SiReactquery", color: "#FF4154" },
      { name: "HTML5", icon: "SiHtml5", color: "#E34F26" },
      { name: "CSS3", icon: "SiCss3", color: "#1572B6" },
      { name: "Electron", icon: "SiElectron", color: "#47848F" },
    ],
  },
  {
    id: "backend",
    titleRu: "Бэкенд разработка",
    titleEn: "Backend Development",
    skills: [
      { name: "Go", icon: "SiGo", color: "#00ADD8" },
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "Node.js", icon: "SiNodedotjs", color: "#339933" },
      { name: "Rust", icon: "SiRust", color: "#DEA584" },
      { name: "Java", icon: "FaJava", color: "#ED8B00" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1" },
      { name: "MongoDB", icon: "SiMongodb", color: "#47A248" },
      { name: "Redis", icon: "SiRedis", color: "#DC382D" },
      { name: "MySQL", icon: "SiMysql", color: "#4479A1" },
      { name: "GraphQL", icon: "SiGraphql", color: "#E10098" },
      { name: "Prisma", icon: "SiPrisma", color: "#2D3748" },
      { name: "Express", icon: "SiExpress", color: "#808080" },
      { name: "Fastify", icon: "SiFastify", color: "#808080" },
      { name: "Gin", icon: "SiGo", color: "#00ADD8" },
      { name: "FastAPI", icon: "SiFastapi", color: "#009688" },
    ],
  },
  {
    id: "devops",
    titleRu: "Окружение и CI/CD",
    titleEn: "Environment & CI/CD",
    skills: [
      { name: "Docker", icon: "SiDocker", color: "#2496ED" },
      { name: "Git", icon: "SiGit", color: "#F05032" },
      { name: "GitHub", icon: "SiGithub", color: "#808080" },
      { name: "GitHub Actions", icon: "SiGithubactions", color: "#2088FF" },
      { name: "Linux", icon: "SiLinux", color: "#FCC624" },
      { name: "Bash", icon: "SiGnubash", color: "#4EAA25" },
      { name: "Nginx", icon: "SiNginx", color: "#009639" },
      { name: "Vercel", icon: "SiVercel", color: "#808080" },
      { name: "AWS", icon: "SiAmazonaws", color: "#FF9900" },
      { name: "Cloudflare", icon: "SiCloudflare", color: "#F38020" },
      { name: "Vite", icon: "SiVite", color: "#646CFF" },
      { name: "Webpack", icon: "SiWebpack", color: "#8DD6F9" },
      { name: "ESLint", icon: "SiEslint", color: "#4B32C3" },
      { name: "Prettier", icon: "SiPrettier", color: "#F7B93E" },
      { name: "Jest", icon: "SiJest", color: "#C21325" },
    ],
  },
  {
    id: "data-engineering",
    titleRu: "Data Engineering (изучаю углубленно)",
    titleEn: "Data Engineering (learning)",
    isLearning: true,
    skills: [
      { name: "SQL", icon: "SiPostgresql", color: "#4169E1" },
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "Apache Spark", icon: "SiApachespark", color: "#E25A1C" },
      { name: "Apache Kafka", icon: "SiApachekafka", color: "#231F20" },
      { name: "Apache Airflow", icon: "SiApacheairflow", color: "#017CEE" },
      { name: "ClickHouse", icon: "SiClickhouse", color: "#FFCC01" },
      { name: "ETL", icon: "SiDatabricks", color: "#FF3621" },
      { name: "DWH", icon: "SiSnowflake", color: "#29B5E8" },
      { name: "Data Modeling", icon: "SiDiagramsdotnet", color: "#F08705" },
      { name: "Data Quality", icon: "SiApacheairflow", color: "#017CEE" },
    ],
  },
];
