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
    title TEXT NOT NULL,
    description_ru TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    github_link TEXT DEFAULT '',
    demo_link TEXT DEFAULT '',
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

-- Analytics: daily stats (aggregated)
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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- Insert default data
INSERT INTO about (name_ru, name_en, username, title_ru, title_en, bio_ru, bio_en, photo) VALUES (
    'Георгий',
    'Georgy',
    '@Kyureno',
    'Full-stack разработчик',
    'Full-stack developer',
    'Я full-stack разработчик, в IT с 2021 года — уже более 4 лет в разработке. На фронтенде использую TypeScript, React, Next.js, Vue.js и Nuxt, стилизую через Tailwind и Sass. Бэкенды пишу на Go, Python и Node.js с Express и Fastify. Работаю с PostgreSQL, MongoDB, Redis. Также изучаю Rust и Java для расширения стека. Использую Docker, GitHub Actions, Nginx для CI/CD и деплоя. Учусь в РАНХиГС, дополнительно углубленно изучаю Data Engineering — Apache Spark, Kafka, Airflow и ClickHouse.',
    'I''m a full-stack developer, in IT since 2021 — over 4 years in development. On the frontend I use TypeScript, React, Next.js, Vue.js and Nuxt, styling with Tailwind and Sass. Backends are written in Go, Python and Node.js with Express and Fastify. I work with PostgreSQL, MongoDB, Redis. Also learning Rust and Java to expand my stack. Using Docker, GitHub Actions, Nginx for CI/CD and deployment. Studying at RANEPA, additionally deep diving into Data Engineering — Apache Spark, Kafka, Airflow and ClickHouse.',
    '/logo.png'
) ON CONFLICT DO NOTHING;

INSERT INTO stats (value_ru, value_en, label_ru, label_en, icon, color, sort_order) VALUES
    ('4+ лет', '4+ years', 'в разработке', 'in development', 'calendar', '#3178C6', 1),
    ('10+', '10+', 'проектов', 'projects', 'rocket', '#8B5CF6', 2),
    ('40+', '40+', 'технологий', 'technologies', 'code', '#00ADD8', 3),
    ('РАНХиГС', 'RANEPA', 'обучение', 'studying', 'graduation', '#10B981', 4)
ON CONFLICT DO NOTHING;

INSERT INTO contacts (id, type, label_ru, label_en, value, link, icon, color, sort_order) VALUES
    ('telegram', 'social', 'Telegram', 'Telegram', '@kyurenodev', 'https://t.me/kyurenodev', 'FaTelegram', '#0088cc', 1),
    ('discord', 'social', 'Discord', 'Discord', 'kyureno', 'https://discord.com/users/kyureno', 'FaDiscord', '#5865F2', 2),
    ('github', 'social', 'GitHub', 'GitHub', 'Kyureno2374', 'https://github.com/Kyureno2374', 'FaGithub', '#333333', 3)
ON CONFLICT DO NOTHING;

INSERT INTO skill_categories (id, title_ru, title_en, sort_order) VALUES
    ('frontend', 'Frontend', 'Frontend', 1),
    ('backend', 'Backend', 'Backend', 2),
    ('devops', 'DevOps', 'DevOps', 3),
    ('data', 'Data Engineering', 'Data Engineering', 4)
ON CONFLICT DO NOTHING;

INSERT INTO skills (id, category_id, name, icon, color, sort_order) VALUES
    ('typescript', 'frontend', 'TypeScript', 'SiTypescript', '#3178C6', 1),
    ('react', 'frontend', 'React', 'SiReact', '#61DAFB', 2),
    ('nextjs', 'frontend', 'Next.js', 'SiNextdotjs', '#000000', 3),
    ('vue', 'frontend', 'Vue.js', 'SiVuedotjs', '#4FC08D', 4),
    ('tailwind', 'frontend', 'Tailwind', 'SiTailwindcss', '#06B6D4', 5),
    ('go', 'backend', 'Go', 'SiGo', '#00ADD8', 1),
    ('python', 'backend', 'Python', 'SiPython', '#3776AB', 2),
    ('nodejs', 'backend', 'Node.js', 'SiNodedotjs', '#339933', 3),
    ('postgresql', 'backend', 'PostgreSQL', 'SiPostgresql', '#4169E1', 4),
    ('docker', 'devops', 'Docker', 'SiDocker', '#2496ED', 1),
    ('nginx', 'devops', 'Nginx', 'SiNginx', '#009639', 2),
    ('github-actions', 'devops', 'GitHub Actions', 'SiGithubactions', '#2088FF', 3)
ON CONFLICT DO NOTHING;

INSERT INTO projects (id, title, description_ru, description_en, image, tags, github_link, featured, sort_order) VALUES
    ('portfolio', 'Portfolio v3', 'Персональный сайт-портфолио с админкой', 'Personal portfolio website with admin panel', '/portfolio.jpg', ARRAY['Next.js', 'TypeScript', 'Tailwind', 'Go', 'PostgreSQL'], 'https://github.com/Kyureno2374/portfolio-v3', true, 1)
ON CONFLICT DO NOTHING;
