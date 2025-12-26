// Package handler contains CLI command handlers.
package handler

import (
	"fmt"

	"convex-notes-cli/internal/service"

	"github.com/AlecAivazis/survey/v2"
	"github.com/fatih/color"
)

// UpdateHandler handles the update note command.
type UpdateHandler struct {
	service *service.NoteService
}

// NewUpdateHandler creates a new UpdateHandler.
func NewUpdateHandler(svc *service.NoteService) *UpdateHandler {
	return &UpdateHandler{service: svc}
}

// Execute runs the handler.
func (h *UpdateHandler) Execute() error {
	blue := color.New(color.FgBlue, color.Bold)
	green := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)

	blue.Println("\n📝 Update a note")

	notes, err := h.service.List()
	if err != nil {
		return fmt.Errorf("failed to list notes: %w", err)
	}

	if len(notes) == 0 {
		yellow.Println("📭 No notes to update.")
		return nil
	}

	// Build options
	options := make([]string, len(notes))
	for i, note := range notes {
		options[i] = note.Title
	}

	var selectedIdx int
	if err := survey.AskOne(&survey.Select{
		Message: "Select a note to update:",
		Options: options,
	}, &selectedIdx); err != nil {
		return err
	}

	selected := notes[selectedIdx]

	var title, content string
	if err := survey.AskOne(&survey.Input{
		Message: "New title:",
		Default: selected.Title,
	}, &title); err != nil {
		return err
	}

	if err := survey.AskOne(&survey.Input{
		Message: "New content:",
		Default: selected.Content,
	}, &content); err != nil {
		return err
	}

	if err := h.service.Update(selected.ID, title, content); err != nil {
		return fmt.Errorf("failed to update note: %w", err)
	}

	green.Println("\n✅ Note updated successfully!")

	return nil
}
