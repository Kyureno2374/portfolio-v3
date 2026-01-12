package repository

import (
	"encoding/json"
	"os"
	"sync"

	"server/internal/entity"
)

type ContentRepository struct {
	mu       sync.RWMutex
	filePath string
	content  *entity.SiteContent
}

func NewContentRepository(filePath string) (*ContentRepository, error) {
	repo := &ContentRepository{
		filePath: filePath,
	}

	if err := repo.load(); err != nil {
		// Создаем дефолтный контент если файла нет
		repo.content = getDefaultContent()
		if err := repo.save(); err != nil {
			return nil, err
		}
	}

	return repo, nil
}

func (r *ContentRepository) load() error {
	r.mu.Lock()
	defer r.mu.Unlock()

	data, err := os.ReadFile(r.filePath)
	if err != nil {
		return err
	}

	var content entity.SiteContent
	if err := json.Unmarshal(data, &content); err != nil {
		return err
	}

	r.content = &content
	return nil
}

func (r *ContentRepository) save() error {
	data, err := json.MarshalIndent(r.content, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.filePath, data, 0644)
}

func (r *ContentRepository) GetAll() *entity.SiteContent {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.content
}

func (r *ContentRepository) GetAbout() entity.AboutContent {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.content.About
}

func (r *ContentRepository) UpdateAbout(about entity.AboutContent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.content.About = about
	return r.save()
}

func (r *ContentRepository) GetProjects() []entity.Project {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.content.Projects
}

func (r *ContentRepository) UpdateProjects(projects []entity.Project) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.content.Projects = projects
	return r.save()
}

func (r *ContentRepository) GetSkills() []entity.SkillCategory {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.content.Skills
}

func (r *ContentRepository) UpdateSkills(skills []entity.SkillCategory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.content.Skills = skills
	return r.save()
}

func (r *ContentRepository) GetContacts() []entity.Contact {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.content.Contacts
}

func (r *ContentRepository) UpdateContacts(contacts []entity.Contact) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.content.Contacts = contacts
	return r.save()
}

func getDefaultContent() *entity.SiteContent {
	return &entity.SiteContent{
		About: entity.AboutContent{
			ID:       1,
			Name:     map[string]string{"ru": "Георгий", "en": "Georgy"},
			Username: "@Kyureno",
			Title:    map[string]string{"ru": "Full-stack разработчик", "en": "Full-stack developer"},
			Bio: map[string]string{
				"ru": "Я full-stack разработчик, в IT с 2021 года — уже более 4 лет в разработке. На фронтенде использую TypeScript, React, Next.js, Vue.js и Nuxt, стилизую через Tailwind и Sass. Бэкенды пишу на Go, Python и Node.js с Express и Fastify. Работаю с PostgreSQL, MongoDB, Redis. Также изучаю Rust и Java для расширения стека. Использую Docker, GitHub Actions, Nginx для CI/CD и деплоя. Учусь в РАНХиГС, дополнительно углубленно изучаю Data Engineering — Apache Spark, Kafka, Airflow и ClickHouse.",
				"en": "I'm a full-stack developer, in IT since 2021 — over 4 years in development. On the frontend I use TypeScript, React, Next.js, Vue.js and Nuxt, styling with Tailwind and Sass. Backends are written in Go, Python and Node.js with Express and Fastify. I work with PostgreSQL, MongoDB, Redis. Also learning Rust and Java to expand my stack. Using Docker, GitHub Actions, Nginx for CI/CD and deployment. Studying at RANEPA, additionally deep diving into Data Engineering — Apache Spark, Kafka, Airflow and ClickHouse.",
			},
			Photo: "/logo.png",
			Stats: []entity.Stat{
				{Value: map[string]string{"ru": "4+ лет", "en": "4+ years"}, Label: map[string]string{"ru": "в разработке", "en": "in development"}, Icon: "calendar", Color: "#3178C6"},
				{Value: map[string]string{"ru": "10+", "en": "10+"}, Label: map[string]string{"ru": "проектов", "en": "projects"}, Icon: "rocket", Color: "#8B5CF6"},
				{Value: map[string]string{"ru": "40+", "en": "40+"}, Label: map[string]string{"ru": "технологий", "en": "technologies"}, Icon: "code", Color: "#00ADD8"},
				{Value: map[string]string{"ru": "РАНХиГС", "en": "RANEPA"}, Label: map[string]string{"ru": "обучение", "en": "studying"}, Icon: "graduation", Color: "#10B981"},
			},
		},
		Projects: []entity.Project{
			{
				ID:          "portfolio",
				Title:       "Portfolio v3",
				Description: map[string]string{"ru": "Персональный сайт-портфолио", "en": "Personal portfolio website"},
				Image:       "/portfolio.jpg",
				Tags:        []string{"Next.js", "TypeScript", "Tailwind", "Go"},
				Links:       entity.ProjectLinks{Github: "https://github.com/Kyureno2374/portfolio-v3"},
				Featured:    true,
				Order:       1,
			},
		},
		Skills: []entity.SkillCategory{
			{
				ID:    "frontend",
				Title: map[string]string{"ru": "Frontend", "en": "Frontend"},
				Skills: []entity.Skill{
					{ID: "typescript", Name: "TypeScript", Icon: "SiTypescript", Color: "#3178C6"},
					{ID: "react", Name: "React", Icon: "SiReact", Color: "#61DAFB"},
					{ID: "nextjs", Name: "Next.js", Icon: "SiNextdotjs", Color: "#000000"},
				},
				Order: 1,
			},
		},
		Contacts: []entity.Contact{
			{ID: "telegram", Type: "social", Label: map[string]string{"ru": "Telegram", "en": "Telegram"}, Value: "@kyurenodev", Link: "https://t.me/kyurenodev", Icon: "FaTelegram", Color: "#0088cc", Order: 1},
			{ID: "discord", Type: "social", Label: map[string]string{"ru": "Discord", "en": "Discord"}, Value: "kyureno", Link: "https://discord.com/users/kyureno", Icon: "FaDiscord", Color: "#5865F2", Order: 2},
			{ID: "github", Type: "social", Label: map[string]string{"ru": "GitHub", "en": "GitHub"}, Value: "Kyureno2374", Link: "https://github.com/Kyureno2374", Icon: "FaGithub", Color: "#333", Order: 3},
		},
	}
}
