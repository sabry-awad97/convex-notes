// Package handler contains CLI command handlers.
package handler

import (
	"fmt"

	"convex-notes-cli/internal/service"
	"convex-notes-cli/internal/ui"

	"github.com/fatih/color"
)

// ListHandler handles the list notes command.
type ListHandler struct {
	service *service.NoteService
}

// NewListHandler creates a new ListHandler.
func NewListHandler(svc *service.NoteService) *ListHandler {
	return &ListHandler{service: svc}
}

// Execute runs the handler.
func (h *ListHandler) Execute() error {
	blue := color.New(color.FgBlue)
	green := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)

	blue.Println("\n📋 Fetching notes...")

	notes, err := h.service.List()
	if err != nil {
		return fmt.Errorf("failed to list notes: %w", err)
	}

	if len(notes) == 0 {
		yellow.Println("\n📭 No notes found. Create your first one!")
		return nil
	}

	green.Printf("\nFound %d note(s)\n\n", len(notes))
	ui.DisplayNotes(notes)

	return nil
}
