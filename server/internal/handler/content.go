package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"server/internal/entity"
	"server/internal/repository"
)

type ContentHandler struct {
	repo *repository.PostgresRepository
}

func NewContentHandler(repo *repository.PostgresRepository) *ContentHandler {
	return &ContentHandler{repo: repo}
}

// Auth middleware
func (h *ContentHandler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		password := r.Header.Get("X-Admin-Password")
		adminPassword := os.Getenv("ADMIN_PASSWORD")

		if adminPassword == "" || password != adminPassword {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// GET /api/content - получить весь контент
func (h *ContentHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	content, err := h.repo.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, content)
}

// GET /api/content/about
func (h *ContentHandler) GetAbout(w http.ResponseWriter, r *http.Request) {
	about, err := h.repo.GetAbout(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, about)
}

// PUT /api/content/about
func (h *ContentHandler) UpdateAbout(w http.ResponseWriter, r *http.Request) {
	var about entity.AboutContent
	if err := json.NewDecoder(r.Body).Decode(&about); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.UpdateAbout(context.Background(), about); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, about)
}

// GET /api/content/projects
func (h *ContentHandler) GetProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := h.repo.GetProjects(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, projects)
}

// PUT /api/content/projects
func (h *ContentHandler) UpdateProjects(w http.ResponseWriter, r *http.Request) {
	var projects []entity.Project
	if err := json.NewDecoder(r.Body).Decode(&projects); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.UpdateProjects(context.Background(), projects); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, projects)
}

// GET /api/content/skills
func (h *ContentHandler) GetSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := h.repo.GetSkills(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, skills)
}

// PUT /api/content/skills
func (h *ContentHandler) UpdateSkills(w http.ResponseWriter, r *http.Request) {
	var skills []entity.SkillCategory
	if err := json.NewDecoder(r.Body).Decode(&skills); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.UpdateSkills(context.Background(), skills); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, skills)
}

// GET /api/content/contacts
func (h *ContentHandler) GetContacts(w http.ResponseWriter, r *http.Request) {
	contacts, err := h.repo.GetContacts(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusOK, contacts)
}

// PUT /api/content/contacts
func (h *ContentHandler) UpdateContacts(w http.ResponseWriter, r *http.Request) {
	var contacts []entity.Contact
	if err := json.NewDecoder(r.Body).Decode(&contacts); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.UpdateContacts(context.Background(), contacts); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, contacts)
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
