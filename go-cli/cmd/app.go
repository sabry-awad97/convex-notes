// Package cmd contains the CLI application.
package cmd

import (
	"fmt"

	"convex-notes-cli/internal/handler"
	"convex-notes-cli/internal/ui"

	"github.com/AlecAivazis/survey/v2"
	"github.com/fatih/color"
)

// App is the main CLI application.
type App struct {
	listHandler   *handler.ListHandler
	createHandler *handler.CreateHandler
	updateHandler *handler.UpdateHandler
	deleteHandler *handler.DeleteHandler
}

// NewApp creates a new App.
func NewApp(
	listHandler *handler.ListHandler,
	createHandler *handler.CreateHandler,
	updateHandler *handler.UpdateHandler,
	deleteHandler *handler.DeleteHandler,
) *App {
	return &App{
		listHandler:   listHandler,
		createHandler: createHandler,
		updateHandler: updateHandler,
		deleteHandler: deleteHandler,
	}
}

// Run starts the application loop.
func (a *App) Run() error {
	ui.PrintBanner()

	options := []string{
		"📋 List all notes",
		"✏️  Create a new note",
		"📝 Update a note",
		"🗑️  Delete a note",
		"🚪 Exit",
	}

	for {
		var choice int
		if err := survey.AskOne(&survey.Select{
			Message: "What would you like to do?",
			Options: options,
		}, &choice); err != nil {
			return nil // User cancelled
		}

		var err error
		switch choice {
		case 0:
			err = a.listHandler.Execute()
		case 1:
			err = a.createHandler.Execute()
		case 2:
			err = a.updateHandler.Execute()
		case 3:
			err = a.deleteHandler.Execute()
		case 4:
			color.Magenta("\n👋 Goodbye!")
			return nil
		}

		if err != nil {
			color.Red("\nError: %v", err)
		}

		fmt.Println()
	}
}
