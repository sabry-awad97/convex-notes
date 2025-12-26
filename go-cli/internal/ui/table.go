// Package ui provides terminal UI components.
package ui

import (
	"os"

	"convex-notes-cli/internal/entity"

	"github.com/olekukonko/tablewriter"
	"github.com/olekukonko/tablewriter/tw"
)

// DisplayNotes shows notes in a table.
func DisplayNotes(notes []entity.Note) {
	if len(notes) == 0 {
		return
	}

	table := tablewriter.NewTable(os.Stdout,
		tablewriter.WithConfig(tablewriter.Config{
			Header: tw.CellConfig{
				Alignment: tw.CellAlignment{Global: tw.AlignCenter},
			},
			Row: tw.CellConfig{
				Alignment: tw.CellAlignment{Global: tw.AlignLeft},
			},
		}),
	)

	table.Header([]string{"ID", "Title", "Content", "Created"})

	for _, note := range notes {
		table.Append([]string{
			note.ShortID(),
			truncate(note.Title, 18),
			note.ContentPreview(),
			note.FormattedCreated(),
		})
	}

	table.Render()
}

func truncate(s string, max int) string {
	if len(s) > max {
		return s[:max] + "..."
	}
	return s
}
