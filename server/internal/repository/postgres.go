package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"server/internal/entity"
)

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(ctx context.Context, connString string) (*PostgresRepository, error) {
	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, fmt.Errorf("failed to create pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping: %w", err)
	}

	repo := &PostgresRepository{pool: pool}
	
	if err := repo.migrate(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to migrate: %w", err)
	}

	return repo, nil
}

func (r *PostgresRepository) migrate(ctx context.Context) error {
	schema := `
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

	CREATE TABLE IF NOT EXISTS skill_categories (
		id TEXT PRIMARY KEY,
		title_ru TEXT NOT NULL,
		title_en TEXT NOT NULL,
		badge_ru TEXT DEFAULT '',
		badge_en TEXT DEFAULT '',
		is_learning BOOLEAN NOT NULL DEFAULT false,
		sort_order INT NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS skills (
		id TEXT PRIMARY KEY,
		category_id TEXT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
		name TEXT NOT NULL,
		icon TEXT NOT NULL,
		color TEXT NOT NULL,
		sort_order INT NOT NULL DEFAULT 0
	);

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

	CREATE TABLE IF NOT EXISTS page_views (
		id SERIAL PRIMARY KEY,
		page TEXT NOT NULL,
		visitor_id TEXT NOT NULL,
		device TEXT NOT NULL DEFAULT 'desktop',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

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

	CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
	CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
	CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);
	CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
	`

	_, err := r.pool.Exec(ctx, schema)
	if err != nil {
		return err
	}

	// Insert default data if about is empty
	var count int
	err = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM about").Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		if err := r.seedData(ctx); err != nil {
			return err
		}
	}

	return nil
}

func (r *PostgresRepository) seedData(ctx context.Context) error {
	// About
	_, err := r.pool.Exec(ctx, `
		INSERT INTO about (name_ru, name_en, username, title_ru, title_en, bio_ru, bio_en, photo) VALUES (
			'Георгий', 'Georgy', '@Kyureno',
			'Full-stack разработчик', 'Full-stack developer',
			'Я full-stack разработчик, в IT с 2021 года — уже более 4 лет в разработке. На фронтенде использую TypeScript, React, Next.js, Vue.js и Nuxt, стилизую через Tailwind и Sass. Бэкенды пишу на Go, Python и Node.js с Express и Fastify. Работаю с PostgreSQL, MongoDB, Redis. Также изучаю Rust и Java для расширения стека. Использую Docker, GitHub Actions, Nginx для CI/CD и деплоя. Учусь в РАНХиГС, дополнительно углубленно изучаю Data Engineering — Apache Spark, Kafka, Airflow и ClickHouse.',
			'I''m a full-stack developer, in IT since 2021 — over 4 years in development. On the frontend I use TypeScript, React, Next.js, Vue.js and Nuxt, styling with Tailwind and Sass. Backends are written in Go, Python and Node.js with Express and Fastify. I work with PostgreSQL, MongoDB, Redis. Also learning Rust and Java to expand my stack. Using Docker, GitHub Actions, Nginx for CI/CD and deployment. Studying at RANEPA, additionally deep diving into Data Engineering — Apache Spark, Kafka, Airflow and ClickHouse.',
			'/logo.png'
		)
	`)
	if err != nil {
		return err
	}

	// Stats
	_, err = r.pool.Exec(ctx, `
		INSERT INTO stats (value_ru, value_en, label_ru, label_en, icon, color, sort_order) VALUES
			('4+ лет', '4+ years', 'в разработке', 'in development', 'calendar', '#3178C6', 1),
			('10+', '10+', 'проектов', 'projects', 'rocket', '#8B5CF6', 2),
			('40+', '40+', 'технологий', 'technologies', 'code', '#00ADD8', 3),
			('РАНХиГС', 'RANEPA', 'обучение', 'studying', 'graduation', '#10B981', 4)
	`)
	if err != nil {
		return err
	}

	// Contacts
	_, err = r.pool.Exec(ctx, `
		INSERT INTO contacts (id, type, label_ru, label_en, value, link, icon, color, sort_order) VALUES
			('telegram', 'social', 'Telegram', 'Telegram', '@kyurenodev', 'https://t.me/kyurenodev', 'FaTelegram', '#0088cc', 1),
			('discord', 'social', 'Discord', 'Discord', 'kyureno', 'https://discord.com/users/kyureno', 'FaDiscord', '#5865F2', 2),
			('github', 'social', 'GitHub', 'GitHub', 'Kyureno2374', 'https://github.com/Kyureno2374', 'FaGithub', '#333333', 3)
	`)
	if err != nil {
		return err
	}

	// Projects
	_, err = r.pool.Exec(ctx, `
		INSERT INTO projects (id, title_ru, title_en, description_ru, description_en, categories, image, tags, url, glow_color, featured, sort_order) VALUES
			('portfolio', 'Портфолио', 'Portfolio', 
			 'Персональный сайт-портфолио с Liquid Glass UI, адаптивным дизайном и поддержкой темной темы.',
			 'Personal portfolio website with Liquid Glass UI, responsive design and dark theme support.',
			 ARRAY['fullstack', 'design'], '/portfolio.jpg', 
			 ARRAY['Next.js', 'TypeScript', 'Tailwind', 'Go', 'PostgreSQL'],
			 'https://kyureno.dev', '#3178C6', true, 1),
			('oll', 'OsuServerLauncher', 'OsuServerLauncher',
			 'Современный лаунчер для приватных серверов osu! с управлением серверами, темами и мультиязычностью.',
			 'Modern launcher for osu! private servers with server management, themes and multilingual support.',
			 ARRAY['frontend', 'design'], '/oll.jpg',
			 ARRAY['Electron', 'React', 'TypeScript', 'Tailwind', 'Vite'],
			 'https://github.com/Kyureno2374/OsuServerLauncher', '#FF66AA', true, 2)
	`)
	if err != nil {
		return err
	}

	// Skill categories
	_, err = r.pool.Exec(ctx, `
		INSERT INTO skill_categories (id, title_ru, title_en, is_learning, sort_order) VALUES
			('frontend', 'Фронтенд', 'Frontend', false, 1),
			('backend', 'Бэкенд разработка', 'Backend Development', false, 2),
			('devops', 'Окружение и CI/CD', 'Environment & CI/CD', false, 3),
			('data-engineering', 'Data Engineering (изучаю углубленно)', 'Data Engineering (learning)', true, 4)
	`)
	if err != nil {
		return err
	}

	// Skills - Frontend
	_, err = r.pool.Exec(ctx, `
		INSERT INTO skills (id, category_id, name, icon, color, sort_order) VALUES
			('typescript', 'frontend', 'TypeScript', 'SiTypescript', '#3178C6', 1),
			('javascript', 'frontend', 'JavaScript', 'SiJavascript', '#F7DF1E', 2),
			('react', 'frontend', 'React', 'SiReact', '#61DAFB', 3),
			('nextjs', 'frontend', 'Next.js', 'SiNextdotjs', '#808080', 4),
			('vue', 'frontend', 'Vue.js', 'SiVuedotjs', '#4FC08D', 5),
			('nuxt', 'frontend', 'Nuxt', 'SiNuxtdotjs', '#00DC82', 6),
			('tailwind', 'frontend', 'Tailwind CSS', 'SiTailwindcss', '#06B6D4', 7),
			('sass', 'frontend', 'Sass', 'SiSass', '#CC6699', 8),
			('framer', 'frontend', 'Framer Motion', 'SiFramer', '#0055FF', 9),
			('redux', 'frontend', 'Redux', 'SiRedux', '#764ABC', 10),
			('zustand', 'frontend', 'Zustand', 'SiReact', '#443E38', 11),
			('reactquery', 'frontend', 'React Query', 'SiReactquery', '#FF4154', 12),
			('html5', 'frontend', 'HTML5', 'SiHtml5', '#E34F26', 13),
			('css3', 'frontend', 'CSS3', 'SiCss3', '#1572B6', 14),
			('electron', 'frontend', 'Electron', 'SiElectron', '#47848F', 15)
	`)
	if err != nil {
		return err
	}

	// Skills - Backend
	_, err = r.pool.Exec(ctx, `
		INSERT INTO skills (id, category_id, name, icon, color, sort_order) VALUES
			('go', 'backend', 'Go', 'SiGo', '#00ADD8', 1),
			('python', 'backend', 'Python', 'SiPython', '#3776AB', 2),
			('nodejs', 'backend', 'Node.js', 'SiNodedotjs', '#339933', 3),
			('rust', 'backend', 'Rust', 'SiRust', '#DEA584', 4),
			('java', 'backend', 'Java', 'FaJava', '#ED8B00', 5),
			('postgresql', 'backend', 'PostgreSQL', 'SiPostgresql', '#4169E1', 6),
			('mongodb', 'backend', 'MongoDB', 'SiMongodb', '#47A248', 7),
			('redis', 'backend', 'Redis', 'SiRedis', '#DC382D', 8),
			('mysql', 'backend', 'MySQL', 'SiMysql', '#4479A1', 9),
			('graphql', 'backend', 'GraphQL', 'SiGraphql', '#E10098', 10),
			('prisma', 'backend', 'Prisma', 'SiPrisma', '#2D3748', 11),
			('express', 'backend', 'Express', 'SiExpress', '#808080', 12),
			('fastify', 'backend', 'Fastify', 'SiFastify', '#808080', 13),
			('gin', 'backend', 'Gin', 'SiGo', '#00ADD8', 14),
			('fastapi', 'backend', 'FastAPI', 'SiFastapi', '#009688', 15)
	`)
	if err != nil {
		return err
	}

	// Skills - DevOps
	_, err = r.pool.Exec(ctx, `
		INSERT INTO skills (id, category_id, name, icon, color, sort_order) VALUES
			('docker', 'devops', 'Docker', 'SiDocker', '#2496ED', 1),
			('git', 'devops', 'Git', 'SiGit', '#F05032', 2),
			('github', 'devops', 'GitHub', 'SiGithub', '#808080', 3),
			('github-actions', 'devops', 'GitHub Actions', 'SiGithubactions', '#2088FF', 4),
			('linux', 'devops', 'Linux', 'SiLinux', '#FCC624', 5),
			('bash', 'devops', 'Bash', 'SiGnubash', '#4EAA25', 6),
			('nginx', 'devops', 'Nginx', 'SiNginx', '#009639', 7),
			('vercel', 'devops', 'Vercel', 'SiVercel', '#808080', 8),
			('aws', 'devops', 'AWS', 'SiAmazonaws', '#FF9900', 9),
			('cloudflare', 'devops', 'Cloudflare', 'SiCloudflare', '#F38020', 10),
			('vite', 'devops', 'Vite', 'SiVite', '#646CFF', 11),
			('webpack', 'devops', 'Webpack', 'SiWebpack', '#8DD6F9', 12),
			('eslint', 'devops', 'ESLint', 'SiEslint', '#4B32C3', 13),
			('prettier', 'devops', 'Prettier', 'SiPrettier', '#F7B93E', 14),
			('jest', 'devops', 'Jest', 'SiJest', '#C21325', 15)
	`)
	if err != nil {
		return err
	}

	// Skills - Data Engineering
	_, err = r.pool.Exec(ctx, `
		INSERT INTO skills (id, category_id, name, icon, color, sort_order) VALUES
			('sql', 'data-engineering', 'SQL', 'SiPostgresql', '#4169E1', 1),
			('python-data', 'data-engineering', 'Python', 'SiPython', '#3776AB', 2),
			('spark', 'data-engineering', 'Apache Spark', 'SiApachespark', '#E25A1C', 3),
			('kafka', 'data-engineering', 'Apache Kafka', 'SiApachekafka', '#231F20', 4),
			('airflow', 'data-engineering', 'Apache Airflow', 'SiApacheairflow', '#017CEE', 5),
			('clickhouse', 'data-engineering', 'ClickHouse', 'SiClickhouse', '#FFCC01', 6),
			('etl', 'data-engineering', 'ETL', 'SiDatabricks', '#FF3621', 7),
			('dwh', 'data-engineering', 'DWH', 'SiSnowflake', '#29B5E8', 8),
			('data-modeling', 'data-engineering', 'Data Modeling', 'SiDiagramsdotnet', '#F08705', 9),
			('data-quality', 'data-engineering', 'Data Quality', 'SiApacheairflow', '#017CEE', 10)
	`)
	if err != nil {
		return err
	}

	return nil
}

func (r *PostgresRepository) Close() {
	if r.pool != nil {
		r.pool.Close()
	}
}

// GetAbout returns about content
func (r *PostgresRepository) GetAbout(ctx context.Context) (entity.AboutContent, error) {
	var about entity.AboutContent
	about.Name = make(map[string]string)
	about.Title = make(map[string]string)
	about.Bio = make(map[string]string)

	var nameRu, nameEn, titleRu, titleEn, bioRu, bioEn string
	err := r.pool.QueryRow(ctx, `
		SELECT id, name_ru, name_en, username, title_ru, title_en, bio_ru, bio_en, photo, updated_at
		FROM about LIMIT 1
	`).Scan(
		&about.ID, &nameRu, &nameEn,
		&about.Username, &titleRu, &titleEn,
		&bioRu, &bioEn, &about.Photo, &about.UpdatedAt,
	)
	if err != nil {
		return about, err
	}
	about.Name["ru"] = nameRu
	about.Name["en"] = nameEn
	about.Title["ru"] = titleRu
	about.Title["en"] = titleEn
	about.Bio["ru"] = bioRu
	about.Bio["en"] = bioEn

	// Get stats
	rows, err := r.pool.Query(ctx, `
		SELECT value_ru, value_en, label_ru, label_en, icon, color
		FROM stats ORDER BY sort_order
	`)
	if err != nil {
		return about, err
	}
	defer rows.Close()

	for rows.Next() {
		var stat entity.Stat
		stat.Value = make(map[string]string)
		stat.Label = make(map[string]string)
		var valueRu, valueEn, labelRu, labelEn string
		if err := rows.Scan(&valueRu, &valueEn, &labelRu, &labelEn, &stat.Icon, &stat.Color); err != nil {
			return about, err
		}
		stat.Value["ru"] = valueRu
		stat.Value["en"] = valueEn
		stat.Label["ru"] = labelRu
		stat.Label["en"] = labelEn
		about.Stats = append(about.Stats, stat)
	}

	return about, nil
}

// UpdateAbout updates about content
func (r *PostgresRepository) UpdateAbout(ctx context.Context, about entity.AboutContent) error {
	_, err := r.pool.Exec(ctx, `
		UPDATE about SET
			name_ru = $1, name_en = $2, username = $3,
			title_ru = $4, title_en = $5,
			bio_ru = $6, bio_en = $7, photo = $8,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $9
	`,
		about.Name["ru"], about.Name["en"], about.Username,
		about.Title["ru"], about.Title["en"],
		about.Bio["ru"], about.Bio["en"], about.Photo, about.ID,
	)
	if err != nil {
		return err
	}

	// Update stats - delete and reinsert
	_, err = r.pool.Exec(ctx, "DELETE FROM stats")
	if err != nil {
		return err
	}

	for i, stat := range about.Stats {
		_, err = r.pool.Exec(ctx, `
			INSERT INTO stats (value_ru, value_en, label_ru, label_en, icon, color, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`, stat.Value["ru"], stat.Value["en"], stat.Label["ru"], stat.Label["en"], stat.Icon, stat.Color, i+1)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetProjects returns all projects
func (r *PostgresRepository) GetProjects(ctx context.Context) ([]entity.Project, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, title_ru, title_en, description_ru, description_en, categories, image, tags, url, glow_color, featured, sort_order
		FROM projects ORDER BY sort_order
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []entity.Project
	for rows.Next() {
		var p entity.Project
		p.Title = make(map[string]string)
		p.Description = make(map[string]string)
		var titleRu, titleEn, descRu, descEn string
		if err := rows.Scan(&p.ID, &titleRu, &titleEn, &descRu, &descEn, &p.Categories, &p.Image, &p.Tags, &p.Url, &p.GlowColor, &p.Featured, &p.Order); err != nil {
			return nil, err
		}
		p.Title["ru"] = titleRu
		p.Title["en"] = titleEn
		p.Description["ru"] = descRu
		p.Description["en"] = descEn
		projects = append(projects, p)
	}

	return projects, nil
}

// UpdateProjects updates all projects
func (r *PostgresRepository) UpdateProjects(ctx context.Context, projects []entity.Project) error {
	_, err := r.pool.Exec(ctx, "DELETE FROM projects")
	if err != nil {
		return err
	}

	for i, p := range projects {
		_, err = r.pool.Exec(ctx, `
			INSERT INTO projects (id, title_ru, title_en, description_ru, description_en, categories, image, tags, url, glow_color, featured, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		`, p.ID, p.Title["ru"], p.Title["en"], p.Description["ru"], p.Description["en"], p.Categories, p.Image, p.Tags, p.Url, p.GlowColor, p.Featured, i+1)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetSkills returns all skill categories with skills
func (r *PostgresRepository) GetSkills(ctx context.Context) ([]entity.SkillCategory, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, title_ru, title_en, badge_ru, badge_en, is_learning, sort_order
		FROM skill_categories ORDER BY sort_order
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []entity.SkillCategory
	for rows.Next() {
		var c entity.SkillCategory
		c.Title = make(map[string]string)
		c.Badge = make(map[string]string)
		var titleRu, titleEn string
		var badgeRu, badgeEn *string
		if err := rows.Scan(&c.ID, &titleRu, &titleEn, &badgeRu, &badgeEn, &c.IsLearning, &c.Order); err != nil {
			return nil, err
		}
		c.Title["ru"] = titleRu
		c.Title["en"] = titleEn
		if badgeRu != nil {
			c.Badge["ru"] = *badgeRu
		}
		if badgeEn != nil {
			c.Badge["en"] = *badgeEn
		}
		categories = append(categories, c)
	}

	// Get skills for each category
	for i := range categories {
		categories[i].Skills = []entity.Skill{}
		skillRows, err := r.pool.Query(ctx, `
			SELECT id, name, icon, color FROM skills WHERE category_id = $1 ORDER BY sort_order
		`, categories[i].ID)
		if err != nil {
			return nil, err
		}

		for skillRows.Next() {
			var s entity.Skill
			if err := skillRows.Scan(&s.ID, &s.Name, &s.Icon, &s.Color); err != nil {
				skillRows.Close()
				return nil, err
			}
			categories[i].Skills = append(categories[i].Skills, s)
		}
		skillRows.Close()
	}

	return categories, nil
}

// UpdateSkills updates all skill categories and skills
func (r *PostgresRepository) UpdateSkills(ctx context.Context, categories []entity.SkillCategory) error {
	_, err := r.pool.Exec(ctx, "DELETE FROM skills")
	if err != nil {
		return err
	}
	_, err = r.pool.Exec(ctx, "DELETE FROM skill_categories")
	if err != nil {
		return err
	}

	for i, c := range categories {
		badgeRu := c.Badge["ru"]
		badgeEn := c.Badge["en"]
		_, err = r.pool.Exec(ctx, `
			INSERT INTO skill_categories (id, title_ru, title_en, badge_ru, badge_en, is_learning, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`, c.ID, c.Title["ru"], c.Title["en"], badgeRu, badgeEn, c.IsLearning, i+1)
		if err != nil {
			return err
		}

		for j, s := range c.Skills {
			_, err = r.pool.Exec(ctx, `
				INSERT INTO skills (id, category_id, name, icon, color, sort_order)
				VALUES ($1, $2, $3, $4, $5, $6)
			`, s.ID, c.ID, s.Name, s.Icon, s.Color, j+1)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

// GetContacts returns all contacts
func (r *PostgresRepository) GetContacts(ctx context.Context) ([]entity.Contact, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, type, label_ru, label_en, value, link, icon, color, sort_order
		FROM contacts ORDER BY sort_order
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var contacts []entity.Contact
	for rows.Next() {
		var c entity.Contact
		c.Label = make(map[string]string)
		var labelRu, labelEn string
		if err := rows.Scan(&c.ID, &c.Type, &labelRu, &labelEn, &c.Value, &c.Link, &c.Icon, &c.Color, &c.Order); err != nil {
			return nil, err
		}
		c.Label["ru"] = labelRu
		c.Label["en"] = labelEn
		contacts = append(contacts, c)
	}

	return contacts, nil
}

// UpdateContacts updates all contacts
func (r *PostgresRepository) UpdateContacts(ctx context.Context, contacts []entity.Contact) error {
	_, err := r.pool.Exec(ctx, "DELETE FROM contacts")
	if err != nil {
		return err
	}

	for i, c := range contacts {
		_, err = r.pool.Exec(ctx, `
			INSERT INTO contacts (id, type, label_ru, label_en, value, link, icon, color, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, c.ID, c.Type, c.Label["ru"], c.Label["en"], c.Value, c.Link, c.Icon, c.Color, i+1)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetAll returns all content
func (r *PostgresRepository) GetAll(ctx context.Context) (*entity.SiteContent, error) {
	about, err := r.GetAbout(ctx)
	if err != nil {
		return nil, err
	}

	projects, err := r.GetProjects(ctx)
	if err != nil {
		return nil, err
	}

	skills, err := r.GetSkills(ctx)
	if err != nil {
		return nil, err
	}

	contacts, err := r.GetContacts(ctx)
	if err != nil {
		return nil, err
	}

	return &entity.SiteContent{
		About:    about,
		Projects: projects,
		Skills:   skills,
		Contacts: contacts,
	}, nil
}
