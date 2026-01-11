package service

import "server/internal/repository"

type Service struct {
	repo *repository.PostgresRepository
}

func NewService(repo *repository.PostgresRepository) *Service {
	return &Service{repo: repo}
}
