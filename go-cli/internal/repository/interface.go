// Package repository defines data access interfaces.
package repository

import "convex-notes-cli/internal/entity"

// NoteRepository defines the interface for note data access.
type NoteRepository interface {
	List() ([]entity.Note, error)
	Get(id string) (*entity.Note, error)
	Create(note entity.CreateNote) (string, error)
	Update(note entity.UpdateNote) error
	Delete(id string) error
}
