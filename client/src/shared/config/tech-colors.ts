export const techColors: Record<string, string> = {
  // Frontend
  "TypeScript": "#3178C6",
  "TS": "#3178C6",
  "JavaScript": "#F7DF1E",
  "JS": "#F7DF1E",
  "React": "#61DAFB",
  "Next.js": "#808080",
  "Next": "#808080",
  "Vue": "#4FC08D",
  "Nuxt": "#00DC82",
  "Tailwind": "#06B6D4",
  "HTML": "#E34F26",
  "CSS": "#1572B6",
  
  // Backend
  "Go": "#00ADD8",
  "Golang": "#00ADD8",
  "Python": "#3776AB",
  "Rust": "#DEA584",
  "Java": "#ED8B00",
  "Node.js": "#339933",
  "Bun": "#FBF0DF",
  "Express": "#000000",
  "Fastify": "#000000",
  
  // Databases
  "PostgreSQL": "#4169E1",
  "MongoDB": "#47A248",
  "Redis": "#DC382D",
  "MySQL": "#4479A1",
  
  // Tools
  "Docker": "#2496ED",
  "Git": "#F05032",
  "Linux": "#FCC624",
  "AWS": "#FF9900",
  
  // Other
  "РАНХиГС": "#1E3A8A",
  "full-stack": "#8B5CF6",
  "Full-stack": "#8B5CF6",
};

export function getTechColor(tech: string): string | null {
  return techColors[tech] || null;
}
