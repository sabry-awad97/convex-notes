// Package handler contains CLI command handlers.
package handler

import (
	"fmt"

	"convex-notes-cli/internal/service"

	"github.com/AlecAivazis/survey/v2"
	"github.com/fatih/color"
)

// DeleteHandler handles the delete note command.
type DeleteHandler struct {
	service *service.NoteService
}

// NewDeleteHandler creates a new DeleteHandler.
func NewDeleteHandler(svc *service.NoteService) *DeleteHandler {
	return &DeleteHandler{service: svc}
}

// Execute runs the handler.
func (h *DeleteHandler) Execute() error {
	red := color.New(color.FgRed, color.Bold)
	green := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)

	red.Println("\n🗑️ Delete a note")

	notes, err := h.service.List()
	if err != nil {
		return fmt.Errorf("failed to list notes: %w", err)
	}

	if len(notes) == 0 {
		yellow.Println("📭 No notes to delete.")
		return nil
	}

	// Build options
	options := make([]string, len(notes))
	for i, note := range notes {
		options[i] = note.Title
	}

	var selectedIdx int
	if err := survey.AskOne(&survey.Select{
		Message: "Select a note to delete:",
		Options: options,
	}, &selectedIdx); err != nil {
		return err
	}

	selected := notes[selectedIdx]

	var confirmed bool
	if err := survey.AskOne(&survey.Confirm{
		Message: fmt.Sprintf("Are you sure you want to delete '%s'?", selected.Title),
		Default: false,
	}, &confirmed); err != nil {
		return err
	}

	if !confirmed {
		yellow.Println("Cancelled.")
		return nil
	}

	if err := h.service.Delete(selected.ID); err != nil {
		return fmt.Errorf("failed to delete note: %w", err)
	}

	green.Printf("\n✅ Note '%s' deleted.\n", selected.Title)

	return nil
}
