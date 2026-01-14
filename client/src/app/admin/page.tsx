"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaUsers, FaEye, FaClock, FaChartLine, FaDesktop, FaMobile, FaTabletAlt,
  FaSun, FaMoon, FaGlobe, FaArrowUp, FaSignOutAlt, FaEdit
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/shared/lib/language-context";
import { GridBackground } from "@/shared/ui/grid-background";
import { getAnalytics, type AnalyticsData } from "@/shared/api/analytics";
import { LiquidGlass } from "@/shared/ui/liquid-glass";

const pageNames: Record<string, string> = {
  "/": "Главная",
  "/projects": "Проекты",
  "/skills": "Скиллы",
  "/contact": "Контакты",
  "/login": "Логин",
  "/admin": "Админка",
};

export default function AdminPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "devices">("overview");

  useEffect(() => {
    const password = localStorage.getItem("admin_password") || "";
    
    const fetchData = async () => {
      const result = await getAnalytics(password);
      setData(result);
      setLoading(false);
    };

    fetchData();
    
    // Обновляем каждые 10 секунд
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("admin_password");
    router.push("/");
  };

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

  if (!data) {
    return (
      <>
        <GridBackground />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-secondary dark:text-dark-secondary mb-4">
              {language === "ru" ? "Не удалось загрузить аналитику" : "Failed to load analytics"}
            </p>
            <p className="text-xs text-secondary/50 dark:text-dark-secondary/50 mb-4">
              Убедитесь что сервер запущен и пароль верный
            </p>
            <Link href="/admin/edit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Перейти к редактированию
            </Link>
          </div>
        </div>
      </>
    );
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}с`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}м ${secs}с`;
  };

  const stats = [
    {
      label: language === "ru" ? "Всего визитов" : "Total Visits",
      value: data.total_visits,
      icon: FaEye,
      color: "#3178C6",
      change: data.today_visits,
      changeLabel: language === "ru" ? "сегодня" : "today",
    },
    {
      label: language === "ru" ? "Уникальных" : "Unique Visitors",
      value: data.unique_visitors,
      icon: FaUsers,
      color: "#8B5CF6",
      change: null,
    },
    {
      label: language === "ru" ? "Ср. время" : "Avg. Duration",
      value: formatDuration(data.avg_session_duration),
      icon: FaClock,
      color: "#10B981",
      change: null,
    },
    {
      label: language === "ru" ? "За неделю" : "This Week",
      value: data.week_visits,
      icon: FaChartLine,
      color: "#F59E0B",
      change: null,
    },
  ];

  const maxHourVisits = Math.max(...data.visits_by_hour, 1);

  return (
    <>
      <GridBackground />
      
      <div className="min-h-screen px-4 sm:px-6 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-dark-primary">
                {language === "ru" ? "Аналитика" : "Analytics"}
              </h1>
              <p className="text-sm text-secondary dark:text-dark-secondary mt-1">
                {language === "ru" ? "Статистика посещений портфолио" : "Portfolio visit statistics"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/admin/edit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaEdit className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "ru" ? "Редактировать" : "Edit"}</span>
              </Link>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "ru" ? "Выйти" : "Logout"}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <LiquidGlass
                  displacementScale={1.5}
                  blurAmount={2.0}
                  elasticity={0.8}
                  cornerRadius={16}
                  isInteractive={false}
                  className="bg-white/5 dark:bg-white/[0.02]"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      {stat.change !== null && (
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <FaArrowUp className="w-3 h-3" />
                          <span>+{stat.change}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-dark-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-secondary dark:text-dark-secondary mt-1">
                      {stat.label}
                      {stat.changeLabel && (
                        <span className="text-secondary/50 dark:text-dark-secondary/50 ml-1">
                          ({stat.changeLabel})
                        </span>
                      )}
                    </div>
                  </div>
                </LiquidGlass>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                {[
                  { id: "overview", label: language === "ru" ? "Обзор" : "Overview" },
                  { id: "pages", label: language === "ru" ? "Страницы" : "Pages" },
                  { id: "devices", label: language === "ru" ? "Устройства" : "Devices" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? "bg-white/20 dark:bg-white/10 text-primary dark:text-dark-primary"
                        : "text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTab === "overview" && (
              <>
                {/* Hourly Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
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
                      <h3 className="text-lg font-semibold text-primary dark:text-dark-primary mb-4">
                        {language === "ru" ? "Активность по часам" : "Hourly Activity"}
                      </h3>
                      <div className="flex items-end gap-1 h-32">
                        {data.visits_by_hour.map((visits, hour) => (
                          <div
                            key={hour}
                            className="flex-1 flex flex-col items-center gap-1"
                          >
                            <motion.div
                              className="w-full bg-blue-500/60 rounded-t"
                              initial={{ height: 0 }}
                              animate={{ height: `${(visits / maxHourVisits) * 100}%` }}
                              transition={{ delay: 0.3 + hour * 0.02, duration: 0.5 }}
                              style={{ minHeight: visits > 0 ? 4 : 0 }}
                            />
                            {hour % 4 === 0 && (
                              <span className="text-[10px] text-secondary/50 dark:text-dark-secondary/50">
                                {hour}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </LiquidGlass>
                </motion.div>

                {/* Bounce Rate & Theme */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
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
                      <h3 className="text-lg font-semibold text-primary dark:text-dark-primary mb-4">
                        {language === "ru" ? "Предпочтения" : "Preferences"}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Bounce Rate */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-secondary dark:text-dark-secondary">
                              {language === "ru" ? "Показатель отказов" : "Bounce Rate"}
                            </span>
                            <span className="text-primary dark:text-dark-primary font-medium">
                              {data.bounce_rate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(data.bounce_rate, 100)}%` }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                            />
                          </div>
                        </div>

                        {/* Themes */}
                        <div className="flex gap-4">
                          <div className="flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-2 mb-1">
                              <FaSun className="w-4 h-4 text-yellow-500" />
                              <span className="text-xs text-secondary dark:text-dark-secondary">
                                {language === "ru" ? "Светлая" : "Light"}
                              </span>
                            </div>
                            <div className="text-xl font-bold text-primary dark:text-dark-primary">
                              {data.themes.light}
                            </div>
                          </div>
                          <div className="flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-2 mb-1">
                              <FaMoon className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-secondary dark:text-dark-secondary">
                                {language === "ru" ? "Тёмная" : "Dark"}
                              </span>
                            </div>
                            <div className="text-xl font-bold text-primary dark:text-dark-primary">
                              {data.themes.dark}
                            </div>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex gap-4">
                          <div className="flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-2 mb-1">
                              <FaGlobe className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-secondary dark:text-dark-secondary">RU</span>
                            </div>
                            <div className="text-xl font-bold text-primary dark:text-dark-primary">
                              {data.languages.ru}
                            </div>
                          </div>
                          <div className="flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-2 mb-1">
                              <FaGlobe className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-secondary dark:text-dark-secondary">EN</span>
                            </div>
                            <div className="text-xl font-bold text-primary dark:text-dark-primary">
                              {data.languages.en}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LiquidGlass>
                </motion.div>
              </>
            )}

            {activeTab === "pages" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
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
                    <h3 className="text-lg font-semibold text-primary dark:text-dark-primary mb-4">
                      {language === "ru" ? "Популярные страницы" : "Popular Pages"}
                    </h3>
                    
                    <div className="space-y-3">
                      {data.top_pages.length === 0 ? (
                        <p className="text-secondary dark:text-dark-secondary text-sm">
                          {language === "ru" ? "Пока нет данных" : "No data yet"}
                        </p>
                      ) : (
                        data.top_pages.map((page, index) => {
                          const maxViews = data.top_pages[0]?.views || 1;
                          const percent = (page.views / maxViews) * 100;
                          
                          return (
                            <motion.div
                              key={page.page}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-primary dark:text-dark-primary font-medium">
                                  {pageNames[page.page] || page.page}
                                </span>
                                <span className="text-sm text-secondary dark:text-dark-secondary">
                                  {page.views} {language === "ru" ? "просм." : "views"}
                                </span>
                              </div>
                              <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                                />
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </LiquidGlass>
              </motion.div>
            )}

            {activeTab === "devices" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
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
                    <h3 className="text-lg font-semibold text-primary dark:text-dark-primary mb-6">
                      {language === "ru" ? "Устройства" : "Devices"}
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { key: "desktop", icon: FaDesktop, label: language === "ru" ? "Компьютер" : "Desktop", color: "#3178C6" },
                        { key: "mobile", icon: FaMobile, label: language === "ru" ? "Телефон" : "Mobile", color: "#10B981" },
                        { key: "tablet", icon: FaTabletAlt, label: language === "ru" ? "Планшет" : "Tablet", color: "#F59E0B" },
                      ].map((device) => {
                        const total = data.devices.desktop + data.devices.mobile + data.devices.tablet;
                        const value = data.devices[device.key as keyof typeof data.devices];
                        const percent = total > 0 ? (value / total) * 100 : 0;
                        
                        return (
                          <motion.div
                            key={device.key}
                            className="text-center p-4 rounded-xl bg-black/5 dark:bg-white/5"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div
                              className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
                              style={{ backgroundColor: `${device.color}20` }}
                            >
                              <device.icon className="w-6 h-6" style={{ color: device.color }} />
                            </div>
                            <div className="text-2xl font-bold text-primary dark:text-dark-primary">
                              {value}
                            </div>
                            <div className="text-xs text-secondary dark:text-dark-secondary">
                              {device.label}
                            </div>
                            <div className="text-xs text-secondary/50 dark:text-dark-secondary/50 mt-1">
                              {percent.toFixed(1)}%
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </LiquidGlass>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
