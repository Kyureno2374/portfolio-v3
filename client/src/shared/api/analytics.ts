const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface AnalyticsData {
  total_visits: number;
  unique_visitors: number;
  today_visits: number;
  week_visits: number;
  avg_session_duration: number;
  bounce_rate: number;
  page_views: Record<string, number>;
  top_pages: { page: string; views: number }[];
  visits_by_day: { date: string; visits: number }[];
  visits_by_hour: number[];
  devices: { desktop: number; mobile: number; tablet: number };
  themes: { light: number; dark: number };
  languages: { ru: number; en: number };
}

// Track page view
export async function trackPageView(page: string, visitorId: string, device: string) {
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "page_view",
        page,
        visitor_id: visitorId,
        device,
      }),
    });
  } catch {
    // Silently fail - analytics shouldn't break the app
  }
}

// Track session end
export async function trackSession(
  visitorId: string,
  duration: number,
  pages: number,
  theme: string,
  language: string
) {
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "session",
        visitor_id: visitorId,
        duration,
        pages,
        theme,
        language,
      }),
    });
  } catch {
    // Silently fail
  }
}

// Get analytics (admin only)
export async function getAnalytics(password: string): Promise<AnalyticsData | null> {
  try {
    const res = await fetch(`${API_URL}/analytics`, {
      headers: { "X-Admin-Password": password },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
