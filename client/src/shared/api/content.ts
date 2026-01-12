const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface AboutContent {
  id: number;
  name: { ru: string; en: string };
  username: string;
  title: { ru: string; en: string };
  bio: { ru: string; en: string };
  photo: string;
  stats: Stat[];
  updated_at?: string;
}

export interface Stat {
  value: { ru: string; en: string };
  label: { ru: string; en: string };
  icon: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: { ru: string; en: string };
  image: string;
  tags: string[];
  links: { github?: string; demo?: string };
  featured: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SkillCategory {
  id: string;
  title: { ru: string; en: string };
  skills: Skill[];
  badge?: { ru: string; en: string };
  order: number;
}

export interface Contact {
  id: string;
  type: string;
  label: { ru: string; en: string };
  value: string;
  link: string;
  icon: string;
  color: string;
  order: number;
}

export interface SiteContent {
  about: AboutContent;
  projects: Project[];
  skills: SkillCategory[];
  contacts: Contact[];
}

// Get all content
export async function getContent(): Promise<SiteContent> {
  const res = await fetch(`${API_URL}/content`);
  if (!res.ok) throw new Error("Failed to fetch content");
  return res.json();
}

// Get about
export async function getAbout(): Promise<AboutContent> {
  const res = await fetch(`${API_URL}/content/about`);
  if (!res.ok) throw new Error("Failed to fetch about");
  return res.json();
}

// Update about
export async function updateAbout(about: AboutContent, password: string): Promise<AboutContent> {
  const res = await fetch(`${API_URL}/content/about`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify(about),
  });
  if (!res.ok) throw new Error("Failed to update about");
  return res.json();
}

// Get projects
export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/content/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

// Update projects
export async function updateProjects(projects: Project[], password: string): Promise<Project[]> {
  const res = await fetch(`${API_URL}/content/projects`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify(projects),
  });
  if (!res.ok) throw new Error("Failed to update projects");
  return res.json();
}

// Get skills
export async function getSkills(): Promise<SkillCategory[]> {
  const res = await fetch(`${API_URL}/content/skills`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
}

// Update skills
export async function updateSkills(skills: SkillCategory[], password: string): Promise<SkillCategory[]> {
  const res = await fetch(`${API_URL}/content/skills`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify(skills),
  });
  if (!res.ok) throw new Error("Failed to update skills");
  return res.json();
}

// Get contacts
export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_URL}/content/contacts`);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}

// Update contacts
export async function updateContacts(contacts: Contact[], password: string): Promise<Contact[]> {
  const res = await fetch(`${API_URL}/content/contacts`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify(contacts),
  });
  if (!res.ok) throw new Error("Failed to update contacts");
  return res.json();
}
