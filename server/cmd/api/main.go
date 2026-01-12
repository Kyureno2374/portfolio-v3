package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"server/internal/handler"
	"server/internal/repository"
)

func main() {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	// Content repository (JSON file)
	contentRepo, err := repository.NewContentRepository("data/content.json")
	if err != nil {
		log.Fatalf("Failed to init content repository: %v", err)
	}

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://kyureno.dev"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Admin-Password"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	contentHandler := handler.NewContentHandler(contentRepo)

	r.Route("/api", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"status":"ok"}`))
		})

		// Public routes
		r.Get("/content", contentHandler.GetAll)
		r.Get("/content/about", contentHandler.GetAbout)
		r.Get("/content/projects", contentHandler.GetProjects)
		r.Get("/content/skills", contentHandler.GetSkills)
		r.Get("/content/contacts", contentHandler.GetContacts)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(contentHandler.AuthMiddleware)
			r.Put("/content/about", contentHandler.UpdateAbout)
			r.Put("/content/projects", contentHandler.UpdateProjects)
			r.Put("/content/skills", contentHandler.UpdateSkills)
			r.Put("/content/contacts", contentHandler.UpdateContacts)
		})
	})

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("Server starting on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
