// Convex Notes CLI - Go client with uber fx DI.
package main

import (
	"context"
	"fmt"
	"os"

	"convex-notes-cli/cmd"
	"convex-notes-cli/internal/handler"
	"convex-notes-cli/internal/repository"
	"convex-notes-cli/internal/service"

	"github.com/fatih/color"
	"go.uber.org/fx"
)

// Config holds application configuration.
type Config struct {
	ConvexURL string
}

// NewConfig creates config from environment.
func NewConfig() *Config {
	url := os.Getenv("CONVEX_URL")
	if url == "" {
		url = "http://127.0.0.1:3210"
	}
	return &Config{ConvexURL: url}
}

// NewRepository creates a new Convex repository.
func NewRepository(cfg *Config) repository.NoteRepository {
	return repository.NewConvexRepository(cfg.ConvexURL)
}

// NewNoteService creates a new note service.
func NewNoteService(repo repository.NoteRepository) *service.NoteService {
	return service.NewNoteService(repo)
}

func main() {
	cyan := color.New(color.FgCyan)
	green := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)

	cfg := NewConfig()
	cyan.Print("🚀 ")
	fmt.Printf("Connecting to %s...\n", yellow.Sprint(cfg.ConvexURL))
	green.Println("✅ Ready!")
	fmt.Println()

	app := fx.New(
		fx.NopLogger, // Silence fx logs

		// Provide dependencies
		fx.Provide(
			NewConfig,
			NewRepository,
			NewNoteService,
			handler.NewListHandler,
			handler.NewCreateHandler,
			handler.NewUpdateHandler,
			handler.NewDeleteHandler,
			cmd.NewApp,
		),

		// Invoke the app
		fx.Invoke(func(app *cmd.App, lc fx.Lifecycle) {
			lc.Append(fx.Hook{
				OnStart: func(ctx context.Context) error {
					go func() {
						if err := app.Run(); err != nil {
							color.Red("Error: %v", err)
						}
						os.Exit(0)
					}()
					return nil
				},
			})
		}),
	)

	app.Run()
}
