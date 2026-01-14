package handler

import (
	"encoding/json"
	"net/http"

	"server/internal/entity"
	"server/internal/repository"
)

type AnalyticsHandler struct {
	repo *repository.PostgresRepository
}

func NewAnalyticsHandler(repo *repository.PostgresRepository) *AnalyticsHandler {
	return &AnalyticsHandler{repo: repo}
}

// POST /api/analytics/track - track events
func (h *AnalyticsHandler) Track(w http.ResponseWriter, r *http.Request) {
	var req entity.TrackEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	switch req.Event {
	case "page_view":
		if err := h.repo.TrackPageView(ctx, req.Page, req.VisitorID, req.Device); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case "session":
		if err := h.repo.TrackSession(ctx, req.VisitorID, req.Duration, req.Pages, req.Theme, req.Language); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "Unknown event type", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

// GET /api/analytics - get analytics data (protected)
func (h *AnalyticsHandler) GetAnalytics(w http.ResponseWriter, r *http.Request) {
	data, err := h.repo.GetAnalytics(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
