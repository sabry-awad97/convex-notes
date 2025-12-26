use anyhow::Result;
use futures::stream::BoxStream;
use std::sync::Arc;

use crate::entity::{CreateNote, Note, UpdateNote};
use crate::repository::NoteRepository;

/// Service for note business logic.
///
/// Wraps a repository and provides high-level operations.
pub struct NoteService<R: NoteRepository> {
    repository: Arc<R>,
}

impl<R: NoteRepository> NoteService<R> {
    /// Create a new NoteService with the given repository.
    pub fn new(repository: R) -> Self {
        Self {
            repository: Arc::new(repository),
        }
    }

    /// Create from an already-wrapped Arc.
    pub fn from_arc(repository: Arc<R>) -> Self {
        Self { repository }
    }

    /// List all notes.
    pub async fn list(&self) -> Result<Vec<Note>> {
        self.repository.list().await
    }

    /// Get a note by ID.
    pub async fn get(&self, id: &str) -> Result<Option<Note>> {
        self.repository.get(id).await
    }

    /// Create a new note with validation.
    pub async fn create(&self, note: CreateNote) -> Result<String> {
        note.validate().map_err(|e| anyhow::anyhow!("{}", e))?;
        self.repository.create(note).await
    }

    /// Update an existing note.
    pub async fn update(&self, note: UpdateNote) -> Result<()> {
        self.repository.update(note).await
    }

    /// Delete a note by ID.
    pub async fn delete(&self, id: &str) -> Result<()> {
        self.repository.delete(id).await
    }

    /// Subscribe to note changes.
    pub async fn subscribe(&self) -> Result<BoxStream<'static, Result<Vec<Note>>>> {
        self.repository.subscribe().await
    }
}

impl<R: NoteRepository> Clone for NoteService<R> {
    fn clone(&self) -> Self {
        Self {
            repository: Arc::clone(&self.repository),
        }
    }
}
