package entity

type PageView struct {
	ID        int64  `json:"id"`
	Page      string `json:"page"`
	VisitorID string `json:"visitor_id"`
	Device    string `json:"device"`
	CreatedAt string `json:"created_at"`
}

type Session struct {
	ID              int64  `json:"id"`
	VisitorID       string `json:"visitor_id"`
	DurationSeconds int    `json:"duration_seconds"`
	PagesCount      int    `json:"pages_count"`
	Theme           string `json:"theme"`
	Language        string `json:"language"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
}

type DailyStats struct {
	ID             int64  `json:"id"`
	Date           string `json:"date"`
	Visits         int    `json:"visits"`
	UniqueVisitors int    `json:"unique_visitors"`
	DesktopCount   int    `json:"desktop_count"`
	MobileCount    int    `json:"mobile_count"`
	TabletCount    int    `json:"tablet_count"`
	LightTheme     int    `json:"light_theme"`
	DarkTheme      int    `json:"dark_theme"`
	LangRu         int    `json:"lang_ru"`
	LangEn         int    `json:"lang_en"`
}

type AnalyticsData struct {
	TotalVisits        int                    `json:"total_visits"`
	UniqueVisitors     int                    `json:"unique_visitors"`
	TodayVisits        int                    `json:"today_visits"`
	WeekVisits         int                    `json:"week_visits"`
	AvgSessionDuration float64                `json:"avg_session_duration"`
	BounceRate         float64                `json:"bounce_rate"`
	PageViews          map[string]int         `json:"page_views"`
	TopPages           []TopPage              `json:"top_pages"`
	VisitsByDay        []DayVisits            `json:"visits_by_day"`
	VisitsByHour       []int                  `json:"visits_by_hour"`
	Devices            DeviceStats            `json:"devices"`
	Themes             ThemeStats             `json:"themes"`
	Languages          LanguageStats          `json:"languages"`
}

type TopPage struct {
	Page  string `json:"page"`
	Views int    `json:"views"`
}

type DayVisits struct {
	Date   string `json:"date"`
	Visits int    `json:"visits"`
}

type DeviceStats struct {
	Desktop int `json:"desktop"`
	Mobile  int `json:"mobile"`
	Tablet  int `json:"tablet"`
}

type ThemeStats struct {
	Light int `json:"light"`
	Dark  int `json:"dark"`
}

type LanguageStats struct {
	Ru int `json:"ru"`
	En int `json:"en"`
}

type TrackEventRequest struct {
	Event     string `json:"event"`
	Page      string `json:"page,omitempty"`
	VisitorID string `json:"visitor_id"`
	Device    string `json:"device,omitempty"`
	Theme     string `json:"theme,omitempty"`
	Language  string `json:"language,omitempty"`
	Duration  int    `json:"duration,omitempty"`
	Pages     int    `json:"pages,omitempty"`
}
