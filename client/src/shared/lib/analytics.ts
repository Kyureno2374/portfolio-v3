"use client";

// Типы для аналитики
export interface PageView {
  page: string;
  timestamp: number;
  duration?: number;
  referrer?: string;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: Record<string, number>;
  avgSessionDuration: number;
  todayVisits: number;
  weekVisits: number;
  bounceRate: number;
  topPages: { page: string; views: number }[];
  visitsByDay: { date: string; visits: number }[];
  visitsByHour: number[];
  devices: { desktop: number; mobile: number; tablet: number };
  themes: { light: number; dark: number };
  languages: { ru: number; en: number };
}

const STORAGE_KEY = "portfolio_analytics";
const SESSION_KEY = "portfolio_session";

// Получить или создать ID посетителя
function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

// Получить данные сессии
function getSession(): { startTime: number; pages: string[] } {
  if (typeof window === "undefined") return { startTime: Date.now(), pages: [] };
  
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) {
    return JSON.parse(session);
  }
  
  const newSession = { startTime: Date.now(), pages: [] };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
}

// Обновить сессию
function updateSession(page: string) {
  if (typeof window === "undefined") return;
  
  const session = getSession();
  if (!session.pages.includes(page)) {
    session.pages.push(page);
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Получить все данные аналитики
export function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return getEmptyAnalytics();
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getEmptyAnalytics();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return getEmptyAnalytics();
  }
}

// Пустые данные
function getEmptyAnalytics(): AnalyticsData {
  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: {},
    avgSessionDuration: 0,
    todayVisits: 0,
    weekVisits: 0,
    bounceRate: 0,
    topPages: [],
    visitsByDay: [],
    visitsByHour: Array(24).fill(0),
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    themes: { light: 0, dark: 0 },
    languages: { ru: 0, en: 0 },
  };
}

// Сохранить данные
function saveAnalytics(data: AnalyticsData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Определить тип устройства
function getDeviceType(): "desktop" | "mobile" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

// Трекинг просмотра страницы
export function trackPageView(page: string) {
  if (typeof window === "undefined") return;
  
  const data = getAnalyticsData();
  const now = Date.now();
  const today = new Date().toISOString().split("T")[0];
  const hour = new Date().getHours();
  const visitorId = getVisitorId();
  
  // Обновляем общие счетчики
  data.totalVisits++;
  data.pageViews[page] = (data.pageViews[page] || 0) + 1;
  
  // Уникальные посетители (проверяем по localStorage)
  const visitors = JSON.parse(localStorage.getItem("visitors_list") || "[]");
  if (!visitors.includes(visitorId)) {
    visitors.push(visitorId);
    localStorage.setItem("visitors_list", JSON.stringify(visitors));
    data.uniqueVisitors++;
  }
  
  // Визиты по дням
  const dayIndex = data.visitsByDay.findIndex(d => d.date === today);
  if (dayIndex >= 0) {
    data.visitsByDay[dayIndex].visits++;
  } else {
    data.visitsByDay.push({ date: today, visits: 1 });
    // Храним только последние 30 дней
    if (data.visitsByDay.length > 30) {
      data.visitsByDay.shift();
    }
  }
  
  // Визиты по часам
  data.visitsByHour[hour]++;
  
  // Устройства
  const device = getDeviceType();
  data.devices[device]++;
  
  // Сегодняшние визиты
  const todayData = data.visitsByDay.find(d => d.date === today);
  data.todayVisits = todayData?.visits || 0;
  
  // Недельные визиты
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  data.weekVisits = data.visitsByDay
    .filter(d => new Date(d.date) >= weekAgo)
    .reduce((sum, d) => sum + d.visits, 0);
  
  // Топ страницы
  data.topPages = Object.entries(data.pageViews)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  
  // Обновляем сессию
  updateSession(page);
  
  saveAnalytics(data);
}

// Трекинг темы
export function trackTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  
  const data = getAnalyticsData();
  data.themes[theme]++;
  saveAnalytics(data);
}

// Трекинг языка
export function trackLanguage(lang: "ru" | "en") {
  if (typeof window === "undefined") return;
  
  const data = getAnalyticsData();
  data.languages[lang]++;
  saveAnalytics(data);
}

// Трекинг длительности сессии (вызывать при уходе)
export function trackSessionEnd() {
  if (typeof window === "undefined") return;
  
  const session = getSession();
  const duration = (Date.now() - session.startTime) / 1000; // в секундах
  
  const data = getAnalyticsData();
  
  // Средняя длительность сессии (скользящее среднее)
  if (data.avgSessionDuration === 0) {
    data.avgSessionDuration = duration;
  } else {
    data.avgSessionDuration = (data.avgSessionDuration * 0.9) + (duration * 0.1);
  }
  
  // Bounce rate (если посетили только 1 страницу)
  const totalSessions = data.totalVisits;
  const bounces = session.pages.length <= 1 ? 1 : 0;
  data.bounceRate = ((data.bounceRate * (totalSessions - 1)) + (bounces * 100)) / totalSessions;
  
  saveAnalytics(data);
}

// Сброс аналитики (для тестов)
export function resetAnalytics() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("visitors_list");
}
