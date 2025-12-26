// Package handler contains CLI command handlers.
package handler

import (
	"fmt"

	"convex-notes-cli/internal/service"

	"github.com/AlecAivazis/survey/v2"
	"github.com/fatih/color"
)

// CreateHandler handles the create note command.
type CreateHandler struct {
	service *service.NoteService
}

// NewCreateHandler creates a new CreateHandler.
func NewCreateHandler(svc *service.NoteService) *CreateHandler {
	return &CreateHandler{service: svc}
}

// Execute runs the handler.
func (h *CreateHandler) Execute() error {
	green := color.New(color.FgGreen, color.Bold)
	greenNormal := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)
	red := color.New(color.FgRed)

	green.Println("\n✏️ Create a new note")

	var title, content string

	if err := survey.AskOne(&survey.Input{Message: "Title:"}, &title); err != nil {
		return err
	}

	if title == "" {
		red.Println("❌ Title is required")
		return nil
	}

	if err := survey.AskOne(&survey.Input{Message: "Content:"}, &content); err != nil {
		return err
	}

	if content == "" {
		red.Println("❌ Content is required")
		return nil
	}

	id, err := h.service.Create(title, content)
	if err != nil {
		return fmt.Errorf("failed to create note: %w", err)
	}

	greenNormal.Printf("\n✅ Note '%s' created!\n", yellow.Sprint(title))
	fmt.Printf("   ID: %s\n", id)

	return nil
}
