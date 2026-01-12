"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUser, FaFolder, FaCode, FaEnvelope, FaSave, FaPlus, FaTrash, FaArrowLeft, FaCheck
} from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "@/shared/lib/language-context";
import { GridBackground } from "@/shared/ui/grid-background";
import { LiquidGlass } from "@/shared/ui/liquid-glass";
import {
  getContent,
  updateAbout,
  updateProjects,
  updateSkills,
  updateContacts,
  type SiteContent,
  type AboutContent,
  type Project,
  type SkillCategory,
  type Contact,
} from "@/shared/api/content";

type Tab = "about" | "projects" | "skills" | "contacts";

export default function EditPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadContent();
    // Получаем пароль из cookie или localStorage
    const storedPassword = localStorage.getItem("admin_password") || "";
    setPassword(storedPassword);
  }, []);

  const loadContent = async () => {
    try {
      const data = await getContent();
      setContent(data);
    } catch (err) {
      setError("Не удалось загрузить контент. Убедитесь что сервер запущен.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content || !password) {
      setError("Введите пароль администратора");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      localStorage.setItem("admin_password", password);
      
      await updateAbout(content.about, password);
      await updateProjects(content.projects, password);
      await updateSkills(content.skills, password);
      await updateContacts(content.contacts, password);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Ошибка сохранения. Проверьте пароль.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "about" as Tab, label: language === "ru" ? "Обо мне" : "About", icon: FaUser },
    { id: "projects" as Tab, label: language === "ru" ? "Проекты" : "Projects", icon: FaFolder },
    { id: "skills" as Tab, label: language === "ru" ? "Скиллы" : "Skills", icon: FaCode },
    { id: "contacts" as Tab, label: language === "ru" ? "Контакты" : "Contacts", icon: FaEnvelope },
  ];

  if (loading) {
    return (
      <>
        <GridBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-secondary dark:text-dark-secondary">Загрузка...</div>
        </div>
      </>
    );
  }

  if (!content) {
    return (
      <>
        <GridBackground />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "Ошибка загрузки"}</p>
            <p className="text-sm text-secondary dark:text-dark-secondary mb-4">
              Запустите сервер: cd server && go run cmd/api/main.go
            </p>
            <button onClick={loadContent} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Повторить
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GridBackground />
      
      <div className="min-h-screen px-4 sm:px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4 text-primary dark:text-dark-primary" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-dark-primary">
                  {language === "ru" ? "Редактирование" : "Edit Content"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "ru" ? "Пароль" : "Password"}
                className="w-32 sm:w-40 px-3 py-2 text-sm rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-dark-primary placeholder:text-secondary/50"
              />
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  saved 
                    ? "bg-green-500 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } disabled:opacity-50`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saved ? <FaCheck className="w-4 h-4" /> : <FaSave className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {saving ? "..." : saved ? (language === "ru" ? "Сохранено" : "Saved") : (language === "ru" ? "Сохранить" : "Save")}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <LiquidGlass
              displacementScale={1.0}
              blurAmount={1.5}
              elasticity={0.7}
              cornerRadius={14}
              isInteractive={false}
              className="bg-white/[0.03] dark:bg-white/[0.02] inline-block"
            >
              <div className="flex gap-1 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? "bg-white/20 dark:bg-white/10 text-primary dark:text-dark-primary"
                        : "text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LiquidGlass
              displacementScale={1.5}
              blurAmount={2.0}
              elasticity={0.8}
              cornerRadius={20}
              isInteractive={false}
              className="bg-white/5 dark:bg-white/[0.02]"
            >
              <div className="p-6">
                {activeTab === "about" && (
                  <AboutEditor 
                    about={content.about} 
                    onChange={(about) => setContent({ ...content, about })} 
                  />
                )}
                {activeTab === "projects" && (
                  <ProjectsEditor 
                    projects={content.projects} 
                    onChange={(projects) => setContent({ ...content, projects })} 
                  />
                )}
                {activeTab === "skills" && (
                  <SkillsEditor 
                    skills={content.skills} 
                    onChange={(skills) => setContent({ ...content, skills })} 
                  />
                )}
                {activeTab === "contacts" && (
                  <ContactsEditor 
                    contacts={content.contacts} 
                    onChange={(contacts) => setContent({ ...content, contacts })} 
                  />
                )}
              </div>
            </LiquidGlass>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// About Editor
function AboutEditor({ about, onChange }: { about: AboutContent; onChange: (a: AboutContent) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary dark:text-dark-primary mb-4">Обо мне</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Имя (RU)" value={about.name.ru} onChange={(v) => onChange({ ...about, name: { ...about.name, ru: v } })} />
        <InputField label="Имя (EN)" value={about.name.en} onChange={(v) => onChange({ ...about, name: { ...about.name, en: v } })} />
      </div>
      
      <InputField label="Username" value={about.username} onChange={(v) => onChange({ ...about, username: v })} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Должность (RU)" value={about.title.ru} onChange={(v) => onChange({ ...about, title: { ...about.title, ru: v } })} />
        <InputField label="Должность (EN)" value={about.title.en} onChange={(v) => onChange({ ...about, title: { ...about.title, en: v } })} />
      </div>
      
      <TextareaField label="Био (RU)" value={about.bio.ru} onChange={(v) => onChange({ ...about, bio: { ...about.bio, ru: v } })} />
      <TextareaField label="Био (EN)" value={about.bio.en} onChange={(v) => onChange({ ...about, bio: { ...about.bio, en: v } })} />
      
      <InputField label="Фото URL" value={about.photo} onChange={(v) => onChange({ ...about, photo: v })} />
    </div>
  );
}

// Projects Editor
function ProjectsEditor({ projects, onChange }: { projects: Project[]; onChange: (p: Project[]) => void }) {
  const addProject = () => {
    onChange([...projects, {
      id: `project-${Date.now()}`,
      title: "Новый проект",
      description: { ru: "", en: "" },
      image: "",
      tags: [],
      links: {},
      featured: false,
      order: projects.length + 1,
    }]);
  };

  const updateProject = (index: number, project: Project) => {
    const updated = [...projects];
    updated[index] = project;
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">Проекты</h3>
        <button onClick={addProject} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm hover:bg-blue-500/20 transition-colors">
          <FaPlus className="w-3 h-3" /> Добавить
        </button>
      </div>

      {projects.map((project, index) => (
        <div key={project.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary dark:text-dark-primary">#{index + 1}</span>
            <button onClick={() => removeProject(index)} className="text-red-500 hover:text-red-600">
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <InputField label="Название" value={project.title} onChange={(v) => updateProject(index, { ...project, title: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Описание (RU)" value={project.description.ru} onChange={(v) => updateProject(index, { ...project, description: { ...project.description, ru: v } })} />
            <InputField label="Описание (EN)" value={project.description.en} onChange={(v) => updateProject(index, { ...project, description: { ...project.description, en: v } })} />
          </div>
          <InputField label="Изображение" value={project.image} onChange={(v) => updateProject(index, { ...project, image: v })} />
          <InputField label="Теги (через запятую)" value={project.tags.join(", ")} onChange={(v) => updateProject(index, { ...project, tags: v.split(",").map(t => t.trim()).filter(Boolean) })} />
          <InputField label="GitHub" value={project.links.github || ""} onChange={(v) => updateProject(index, { ...project, links: { ...project.links, github: v } })} />
          <InputField label="Demo" value={project.links.demo || ""} onChange={(v) => updateProject(index, { ...project, links: { ...project.links, demo: v } })} />
        </div>
      ))}
    </div>
  );
}

// Skills Editor
function SkillsEditor({ skills, onChange }: { skills: SkillCategory[]; onChange: (s: SkillCategory[]) => void }) {
  const addCategory = () => {
    onChange([...skills, {
      id: `category-${Date.now()}`,
      title: { ru: "Новая категория", en: "New Category" },
      skills: [],
      order: skills.length + 1,
    }]);
  };

  const updateCategory = (index: number, category: SkillCategory) => {
    const updated = [...skills];
    updated[index] = category;
    onChange(updated);
  };

  const removeCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">Скиллы</h3>
        <button onClick={addCategory} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm hover:bg-blue-500/20 transition-colors">
          <FaPlus className="w-3 h-3" /> Категория
        </button>
      </div>

      {skills.map((category, index) => (
        <div key={category.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary dark:text-dark-primary">{category.title.ru}</span>
            <button onClick={() => removeCategory(index)} className="text-red-500 hover:text-red-600">
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Название (RU)" value={category.title.ru} onChange={(v) => updateCategory(index, { ...category, title: { ...category.title, ru: v } })} />
            <InputField label="Название (EN)" value={category.title.en} onChange={(v) => updateCategory(index, { ...category, title: { ...category.title, en: v } })} />
          </div>
          <InputField 
            label="Скиллы (формат: name:icon:color через запятую)" 
            value={category.skills.map(s => `${s.name}:${s.icon}:${s.color}`).join(", ")} 
            onChange={(v) => {
              const skills = v.split(",").map(s => {
                const [name, icon, color] = s.trim().split(":");
                return { id: name?.toLowerCase() || "", name: name || "", icon: icon || "", color: color || "#000" };
              }).filter(s => s.name);
              updateCategory(index, { ...category, skills });
            }} 
          />
        </div>
      ))}
    </div>
  );
}

// Contacts Editor
function ContactsEditor({ contacts, onChange }: { contacts: Contact[]; onChange: (c: Contact[]) => void }) {
  const addContact = () => {
    onChange([...contacts, {
      id: `contact-${Date.now()}`,
      type: "social",
      label: { ru: "Новый контакт", en: "New Contact" },
      value: "",
      link: "",
      icon: "FaLink",
      color: "#000",
      order: contacts.length + 1,
    }]);
  };

  const updateContact = (index: number, contact: Contact) => {
    const updated = [...contacts];
    updated[index] = contact;
    onChange(updated);
  };

  const removeContact = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">Контакты</h3>
        <button onClick={addContact} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm hover:bg-blue-500/20 transition-colors">
          <FaPlus className="w-3 h-3" /> Добавить
        </button>
      </div>

      {contacts.map((contact, index) => (
        <div key={contact.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary dark:text-dark-primary">{contact.label.ru}</span>
            <button onClick={() => removeContact(index)} className="text-red-500 hover:text-red-600">
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Название (RU)" value={contact.label.ru} onChange={(v) => updateContact(index, { ...contact, label: { ...contact.label, ru: v } })} />
            <InputField label="Название (EN)" value={contact.label.en} onChange={(v) => updateContact(index, { ...contact, label: { ...contact.label, en: v } })} />
          </div>
          <InputField label="Значение" value={contact.value} onChange={(v) => updateContact(index, { ...contact, value: v })} />
          <InputField label="Ссылка" value={contact.link} onChange={(v) => updateContact(index, { ...contact, link: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Иконка (FaTelegram, FaGithub...)" value={contact.icon} onChange={(v) => updateContact(index, { ...contact, icon: v })} />
            <InputField label="Цвет (#hex)" value={contact.color} onChange={(v) => updateContact(index, { ...contact, color: v })} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Input components
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-secondary dark:text-dark-secondary mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-secondary dark:text-dark-secondary mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 text-sm rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
      />
    </div>
  );
}
