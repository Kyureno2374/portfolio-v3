package repository

import (
	"context"
	"time"

	"server/internal/entity"
)

// TrackPageView records a page view
func (r *PostgresRepository) TrackPageView(ctx context.Context, page, visitorID, device string) error {
	// Check if this visitor already visited today
	today := time.Now().Format("2006-01-02")
	var existingVisits int
	err := r.pool.QueryRow(ctx, `
		SELECT COUNT(*) FROM page_views 
		WHERE visitor_id = $1 AND DATE(created_at) = $2
	`, visitorID, today).Scan(&existingVisits)
	if err != nil {
		return err
	}

	isNewVisitor := existingVisits == 0

	// Insert page view
	_, err = r.pool.Exec(ctx, `
		INSERT INTO page_views (page, visitor_id, device)
		VALUES ($1, $2, $3)
	`, page, visitorID, device)
	if err != nil {
		return err
	}

	// Update daily stats
	deviceCol := "desktop_count"
	if device == "mobile" {
		deviceCol = "mobile_count"
	} else if device == "tablet" {
		deviceCol = "tablet_count"
	}

	if isNewVisitor {
		// New visitor today - increment visits, unique_visitors, and device count
		_, err = r.pool.Exec(ctx, `
			INSERT INTO daily_stats (date, visits, unique_visitors, `+deviceCol+`)
			VALUES ($1, 1, 1, 1)
			ON CONFLICT (date) DO UPDATE SET
				visits = daily_stats.visits + 1,
				unique_visitors = daily_stats.unique_visitors + 1,
				`+deviceCol+` = daily_stats.`+deviceCol+` + 1
		`, today)
	} else {
		// Returning visitor - only increment visits
		_, err = r.pool.Exec(ctx, `
			INSERT INTO daily_stats (date, visits, unique_visitors, `+deviceCol+`)
			VALUES ($1, 1, 0, 0)
			ON CONFLICT (date) DO UPDATE SET
				visits = daily_stats.visits + 1
		`, today)
	}

	return err
}

// TrackSession updates or creates a session
func (r *PostgresRepository) TrackSession(ctx context.Context, visitorID string, duration, pages int, theme, language string) error {
	// Check if session already exists
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM sessions WHERE visitor_id = $1)`, visitorID).Scan(&exists)
	if err != nil {
		return err
	}

	_, err = r.pool.Exec(ctx, `
		INSERT INTO sessions (visitor_id, duration_seconds, pages_count, theme, language)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (visitor_id) DO UPDATE SET
			duration_seconds = GREATEST(sessions.duration_seconds, $2),
			pages_count = GREATEST(sessions.pages_count, $3),
			theme = $4,
			language = $5,
			updated_at = CURRENT_TIMESTAMP
	`, visitorID, duration, pages, theme, language)

	if err != nil {
		return err
	}

	// Only update theme/language stats for new sessions
	if !exists {
		today := time.Now().Format("2006-01-02")
		themeCol := "light_theme"
		if theme == "dark" {
			themeCol = "dark_theme"
		}
		langCol := "lang_ru"
		if language == "en" {
			langCol = "lang_en"
		}

		_, err = r.pool.Exec(ctx, `
			INSERT INTO daily_stats (date, visits, `+themeCol+`, `+langCol+`)
			VALUES ($1, 0, 1, 1)
			ON CONFLICT (date) DO UPDATE SET
				`+themeCol+` = daily_stats.`+themeCol+` + 1,
				`+langCol+` = daily_stats.`+langCol+` + 1
		`, today)
	}

	return err
}

// GetAnalytics returns aggregated analytics data
func (r *PostgresRepository) GetAnalytics(ctx context.Context) (*entity.AnalyticsData, error) {
	data := &entity.AnalyticsData{
		PageViews:    make(map[string]int),
		TopPages:     []entity.TopPage{},
		VisitsByDay:  []entity.DayVisits{},
		VisitsByHour: make([]int, 24),
	}

	// Total visits
	err := r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM page_views").Scan(&data.TotalVisits)
	if err != nil {
		return nil, err
	}

	// Unique visitors
	err = r.pool.QueryRow(ctx, "SELECT COUNT(DISTINCT visitor_id) FROM page_views").Scan(&data.UniqueVisitors)
	if err != nil {
		return nil, err
	}

	// Today visits
	today := time.Now().Format("2006-01-02")
	err = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = $1", today).Scan(&data.TodayVisits)
	if err != nil {
		return nil, err
	}

	// Week visits
	weekAgo := time.Now().AddDate(0, 0, -7).Format("2006-01-02")
	err = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM page_views WHERE DATE(created_at) >= $1", weekAgo).Scan(&data.WeekVisits)
	if err != nil {
		return nil, err
	}

	// Average session duration
	err = r.pool.QueryRow(ctx, "SELECT COALESCE(AVG(duration_seconds), 0) FROM sessions").Scan(&data.AvgSessionDuration)
	if err != nil {
		return nil, err
	}

	// Bounce rate (sessions with only 1 page)
	var totalSessions, bounceSessions int
	err = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM sessions").Scan(&totalSessions)
	if err != nil {
		return nil, err
	}
	err = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM sessions WHERE pages_count <= 1").Scan(&bounceSessions)
	if err != nil {
		return nil, err
	}
	if totalSessions > 0 {
		data.BounceRate = float64(bounceSessions) / float64(totalSessions) * 100
	}

	// Top pages
	rows, err := r.pool.Query(ctx, `
		SELECT page, COUNT(*) as views
		FROM page_views
		GROUP BY page
		ORDER BY views DESC
		LIMIT 10
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var tp entity.TopPage
		if err := rows.Scan(&tp.Page, &tp.Views); err != nil {
			return nil, err
		}
		data.TopPages = append(data.TopPages, tp)
		data.PageViews[tp.Page] = tp.Views
	}

	// Visits by day (last 30 days)
	dayRows, err := r.pool.Query(ctx, `
		SELECT date, visits
		FROM daily_stats
		WHERE date >= CURRENT_DATE - INTERVAL '30 days'
		ORDER BY date
	`)
	if err != nil {
		return nil, err
	}
	defer dayRows.Close()

	for dayRows.Next() {
		var dv entity.DayVisits
		var date time.Time
		if err := dayRows.Scan(&date, &dv.Visits); err != nil {
			return nil, err
		}
		dv.Date = date.Format("2006-01-02")
		data.VisitsByDay = append(data.VisitsByDay, dv)
	}

	// Visits by hour (today)
	hourRows, err := r.pool.Query(ctx, `
		SELECT EXTRACT(HOUR FROM created_at)::int as hour, COUNT(*)
		FROM page_views
		WHERE DATE(created_at) = CURRENT_DATE
		GROUP BY hour
		ORDER BY hour
	`)
	if err != nil {
		return nil, err
	}
	defer hourRows.Close()

	for hourRows.Next() {
		var hour, count int
		if err := hourRows.Scan(&hour, &count); err != nil {
			return nil, err
		}
		if hour >= 0 && hour < 24 {
			data.VisitsByHour[hour] = count
		}
	}

	// Device stats
	err = r.pool.QueryRow(ctx, `
		SELECT 
			COALESCE(SUM(desktop_count), 0),
			COALESCE(SUM(mobile_count), 0),
			COALESCE(SUM(tablet_count), 0)
		FROM daily_stats
	`).Scan(&data.Devices.Desktop, &data.Devices.Mobile, &data.Devices.Tablet)
	if err != nil {
		return nil, err
	}

	// Theme stats
	err = r.pool.QueryRow(ctx, `
		SELECT 
			COALESCE(SUM(light_theme), 0),
			COALESCE(SUM(dark_theme), 0)
		FROM daily_stats
	`).Scan(&data.Themes.Light, &data.Themes.Dark)
	if err != nil {
		return nil, err
	}

	// Language stats
	err = r.pool.QueryRow(ctx, `
		SELECT 
			COALESCE(SUM(lang_ru), 0),
			COALESCE(SUM(lang_en), 0)
		FROM daily_stats
	`).Scan(&data.Languages.Ru, &data.Languages.En)
	if err != nil {
		return nil, err
	}

	return data, nil
}
