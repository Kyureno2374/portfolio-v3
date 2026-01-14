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

	return &PostgresRepository{pool: pool}, nil
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

	err := r.pool.QueryRow(ctx, `
		SELECT id, name_ru, name_en, username, title_ru, title_en, bio_ru, bio_en, photo, updated_at
		FROM about LIMIT 1
	`).Scan(
		&about.ID, &about.Name["ru"], &about.Name["en"],
		&about.Username, &about.Title["ru"], &about.Title["en"],
		&about.Bio["ru"], &about.Bio["en"], &about.Photo, &about.UpdatedAt,
	)
	if err != nil {
		return about, err
	}

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
		if err := rows.Scan(&stat.Value["ru"], &stat.Value["en"], &stat.Label["ru"], &stat.Label["en"], &stat.Icon, &stat.Color); err != nil {
			return about, err
		}
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
		SELECT id, title, description_ru, description_en, image, tags, github_link, demo_link, featured, sort_order
		FROM projects ORDER BY sort_order
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []entity.Project
	for rows.Next() {
		var p entity.Project
		p.Description = make(map[string]string)
		var github, demo *string
		if err := rows.Scan(&p.ID, &p.Title, &p.Description["ru"], &p.Description["en"], &p.Image, &p.Tags, &github, &demo, &p.Featured, &p.Order); err != nil {
			return nil, err
		}
		if github != nil {
			p.Links.Github = *github
		}
		if demo != nil {
			p.Links.Demo = *demo
		}
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
			INSERT INTO projects (id, title, description_ru, description_en, image, tags, github_link, demo_link, featured, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		`, p.ID, p.Title, p.Description["ru"], p.Description["en"], p.Image, p.Tags, p.Links.Github, p.Links.Demo, p.Featured, i+1)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetSkills returns all skill categories with skills
func (r *PostgresRepository) GetSkills(ctx context.Context) ([]entity.SkillCategory, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, title_ru, title_en, badge_ru, badge_en, sort_order
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
		var badgeRu, badgeEn *string
		if err := rows.Scan(&c.ID, &c.Title["ru"], &c.Title["en"], &badgeRu, &badgeEn, &c.Order); err != nil {
			return nil, err
		}
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
			INSERT INTO skill_categories (id, title_ru, title_en, badge_ru, badge_en, sort_order)
			VALUES ($1, $2, $3, $4, $5, $6)
		`, c.ID, c.Title["ru"], c.Title["en"], badgeRu, badgeEn, i+1)
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
		if err := rows.Scan(&c.ID, &c.Type, &c.Label["ru"], &c.Label["en"], &c.Value, &c.Link, &c.Icon, &c.Color, &c.Order); err != nil {
			return nil, err
		}
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
