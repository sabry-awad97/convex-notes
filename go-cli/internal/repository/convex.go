// Package repository provides Convex HTTP implementation.
package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"convex-notes-cli/internal/entity"
)

// ConvexRepository implements NoteRepository using HTTP API.
type ConvexRepository struct {
	baseURL string
	client  *http.Client
}

// NewConvexRepository creates a new Convex repository.
func NewConvexRepository(baseURL string) *ConvexRepository {
	return &ConvexRepository{
		baseURL: baseURL,
		client:  &http.Client{},
	}
}

// convexRequest represents the request body for Convex API.
type convexRequest struct {
	Path   string                 `json:"path"`
	Args   map[string]interface{} `json:"args"`
	Format string                 `json:"format"`
}

// convexResponse represents the response from Convex API.
type convexResponse struct {
	Status string          `json:"status"`
	Value  json.RawMessage `json:"value"`
}

func (r *ConvexRepository) callFunction(fnType, path string, args map[string]interface{}) (json.RawMessage, error) {
	reqBody := convexRequest{
		Path:   path,
		Args:   args,
		Format: "json",
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	url := fmt.Sprintf("%s/api/%s", r.baseURL, fnType)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := r.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s", string(body))
	}

	var convexResp convexResponse
	if err := json.Unmarshal(body, &convexResp); err != nil {
		return nil, fmt.Errorf("unmarshal response: %w", err)
	}

	if convexResp.Status != "success" {
		return nil, fmt.Errorf("convex error: %s", string(body))
	}

	return convexResp.Value, nil
}

// List returns all notes.
func (r *ConvexRepository) List() ([]entity.Note, error) {
	value, err := r.callFunction("query", "notes:list", map[string]interface{}{})
	if err != nil {
		return nil, err
	}

	var notes []entity.Note
	if err := json.Unmarshal(value, &notes); err != nil {
		return nil, fmt.Errorf("unmarshal notes: %w", err)
	}

	return notes, nil
}

// Get returns a note by ID.
func (r *ConvexRepository) Get(id string) (*entity.Note, error) {
	value, err := r.callFunction("query", "notes:get", map[string]interface{}{"id": id})
	if err != nil {
		return nil, err
	}

	if string(value) == "null" {
		return nil, nil
	}

	var note entity.Note
	if err := json.Unmarshal(value, &note); err != nil {
		return nil, fmt.Errorf("unmarshal note: %w", err)
	}

	return &note, nil
}

// Create creates a new note and returns the ID.
func (r *ConvexRepository) Create(note entity.CreateNote) (string, error) {
	value, err := r.callFunction("mutation", "notes:create", map[string]interface{}{
		"title":   note.Title,
		"content": note.Content,
	})
	if err != nil {
		return "", err
	}

	var id string
	if err := json.Unmarshal(value, &id); err != nil {
		return "", fmt.Errorf("unmarshal id: %w", err)
	}

	return id, nil
}

// Update updates an existing note.
func (r *ConvexRepository) Update(note entity.UpdateNote) error {
	_, err := r.callFunction("mutation", "notes:update", map[string]interface{}{
		"id":      note.ID,
		"title":   note.Title,
		"content": note.Content,
	})
	return err
}

// Delete removes a note.
func (r *ConvexRepository) Delete(id string) error {
	_, err := r.callFunction("mutation", "notes:remove", map[string]interface{}{"id": id})
	return err
}
