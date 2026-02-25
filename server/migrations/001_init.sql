-- About content
CREATE TABLE IF NOT EXISTS about (
    id SERIAL PRIMARY KEY,
    name_ru TEXT NOT NULL DEFAULT '',
    name_en TEXT NOT NULL DEFAULT '',
    username TEXT NOT NULL DEFAULT '',
    title_ru TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    bio_ru TEXT NOT NULL DEFAULT '',
    bio_en TEXT NOT NULL DEFAULT '',
    photo TEXT NOT NULL DEFAULT '/logo.png',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    value_ru TEXT NOT NULL,
    value_en TEXT NOT NULL,
    label_ru TEXT NOT NULL,
    label_en TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ru TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    categories TEXT[] NOT NULL DEFAULT '{}',
    image TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    url TEXT NOT NULL DEFAULT '',
    glow_color TEXT NOT NULL DEFAULT '#3178C6',
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skill categories
CREATE TABLE IF NOT EXISTS skill_categories (
    id TEXT PRIMARY KEY,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    badge_ru TEXT DEFAULT '',
    badge_en TEXT DEFAULT '',
    is_learning BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'social',
    label_ru TEXT NOT NULL,
    label_en TEXT NOT NULL,
    value TEXT NOT NULL,
    link TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- Analytics: page views
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    device TEXT NOT NULL DEFAULT 'desktop',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics: sessions
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL UNIQUE,
    duration_seconds INT NOT NULL DEFAULT 0,
    pages_count INT NOT NULL DEFAULT 1,
    theme TEXT DEFAULT 'light',
    language TEXT DEFAULT 'ru',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics: daily stats
CREATE TABLE IF NOT EXISTS daily_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    visits INT NOT NULL DEFAULT 0,
    unique_visitors INT NOT NULL DEFAULT 0,
    desktop_count INT NOT NULL DEFAULT 0,
    mobile_count INT NOT NULL DEFAULT 0,
    tablet_count INT NOT NULL DEFAULT 0,
    light_theme INT NOT NULL DEFAULT 0,
    dark_theme INT NOT NULL DEFAULT 0,
    lang_ru INT NOT NULL DEFAULT 0,
    lang_en INT NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
