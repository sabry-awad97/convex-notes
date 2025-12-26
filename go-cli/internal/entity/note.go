// Package entity contains domain types.
package entity

import "time"

// Note represents a stored note.
type Note struct {
	ID        string  `json:"_id"`
	Title     string  `json:"title"`
	Content   string  `json:"content"`
	CreatedAt float64 `json:"createdAt"`
	UpdatedAt float64 `json:"updatedAt"`
}

// ShortID returns a truncated ID for display.
func (n Note) ShortID() string {
	if len(n.ID) > 12 {
		return n.ID[:12]
	}
	return n.ID
}

// ContentPreview returns a truncated content preview.
func (n Note) ContentPreview() string {
	if len(n.Content) > 40 {
		return n.Content[:40] + "..."
	}
	return n.Content
}

// FormattedCreated returns a human-readable creation time.
func (n Note) FormattedCreated() string {
	t := time.UnixMilli(int64(n.CreatedAt))
	return t.Format("2006-01-02 15:04")
}

// CreateNote contains data for creating a note.
type CreateNote struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// UpdateNote contains data for updating a note.
type UpdateNote struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}
