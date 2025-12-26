// Package service contains business logic.
package service

import (
	"convex-notes-cli/internal/entity"
	"convex-notes-cli/internal/repository"
)

// NoteService provides note business logic.
type NoteService struct {
	repo repository.NoteRepository
}

// NewNoteService creates a new NoteService.
func NewNoteService(repo repository.NoteRepository) *NoteService {
	return &NoteService{repo: repo}
}

// List returns all notes.
func (s *NoteService) List() ([]entity.Note, error) {
	return s.repo.List()
}

// Get returns a note by ID.
func (s *NoteService) Get(id string) (*entity.Note, error) {
	return s.repo.Get(id)
}

// Create creates a new note.
func (s *NoteService) Create(title, content string) (string, error) {
	return s.repo.Create(entity.CreateNote{
		Title:   title,
		Content: content,
	})
}

// Update updates an existing note.
func (s *NoteService) Update(id, title, content string) error {
	return s.repo.Update(entity.UpdateNote{
		ID:      id,
		Title:   title,
		Content: content,
	})
}

// Delete removes a note.
func (s *NoteService) Delete(id string) error {
	return s.repo.Delete(id)
}
