use anyhow::Result;
use async_trait::async_trait;
use futures::stream::BoxStream;

use crate::entity::{CreateNote, Note, UpdateNote};

/// Repository trait for note data access.
///
/// This trait defines the contract for note storage operations,
/// allowing different implementations (Convex, in-memory, etc.)
#[async_trait]
pub trait NoteRepository: Send + Sync {
    /// List all notes.
    async fn list(&self) -> Result<Vec<Note>>;

    /// Get a note by ID.
    async fn get(&self, id: &str) -> Result<Option<Note>>;

    /// Create a new note.
    async fn create(&self, note: CreateNote) -> Result<String>;

    /// Update an existing note.
    async fn update(&self, note: UpdateNote) -> Result<()>;

    /// Delete a note by ID.
    async fn delete(&self, id: &str) -> Result<()>;

    /// Subscribe to note changes (real-time updates).
    async fn subscribe(&self) -> Result<BoxStream<'static, Result<Vec<Note>>>>;
}
