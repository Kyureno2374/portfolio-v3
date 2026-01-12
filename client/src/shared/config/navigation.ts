export interface NavItem {
  id: string;
  labelRu: string;
  labelEn: string;
  href: string;
  icon: "folder" | "code" | "envelope";
}

export const navigationItems: NavItem[] = [
  { id: "projects", labelRu: "Проекты", labelEn: "Projects", href: "/projects", icon: "folder" },
  { id: "skills", labelRu: "Скиллы", labelEn: "Skills", href: "/skills", icon: "code" },
  { id: "contact", labelRu: "Связь", labelEn: "Contact", href: "/contact", icon: "envelope" },
];
