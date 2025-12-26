use serde::{Deserialize, Serialize};

/// A note entity representing a stored note.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Note {
    /// Unique identifier
    pub id: String,
    /// Note title
    pub title: String,
    /// Note content
    pub content: String,
    /// Creation timestamp (Unix milliseconds)
    pub created_at: i64,
    /// Last update timestamp (Unix milliseconds)
    pub updated_at: i64,
}

impl Note {
    /// Get a short ID for display (first 12 chars)
    pub fn short_id(&self) -> &str {
        if self.id.len() > 12 {
            &self.id[..12]
        } else {
            &self.id
        }
    }

    /// Get a content preview (max 40 chars)
    pub fn content_preview(&self) -> String {
        if self.content.len() > 40 {
            format!("{}...", &self.content[..40])
        } else {
            self.content.clone()
        }
    }
}

/// Data for creating a new note.
#[derive(Debug, Clone)]
pub struct CreateNote {
    pub title: String,
    pub content: String,
}

impl CreateNote {
    pub fn new(title: impl Into<String>, content: impl Into<String>) -> Self {
        Self {
            title: title.into(),
            content: content.into(),
        }
    }

    /// Validate the note data.
    pub fn validate(&self) -> Result<(), &'static str> {
        if self.title.trim().is_empty() {
            return Err("Title is required");
        }
        if self.content.trim().is_empty() {
            return Err("Content is required");
        }
        Ok(())
    }
}

/// Data for updating an existing note.
#[derive(Debug, Clone)]
pub struct UpdateNote {
    pub id: String,
    pub title: String,
    pub content: String,
}

impl UpdateNote {
    pub fn new(
        id: impl Into<String>,
        title: impl Into<String>,
        content: impl Into<String>,
    ) -> Self {
        Self {
            id: id.into(),
            title: title.into(),
            content: content.into(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_note_short_id() {
        let note = Note {
            id: "abc123def456xyz789".to_string(),
            title: "Test".to_string(),
            content: "Content".to_string(),
            created_at: 0,
            updated_at: 0,
        };
        assert_eq!(note.short_id(), "abc123def456");
    }

    #[test]
    fn test_content_preview() {
        let note = Note {
            id: "1".to_string(),
            title: "Test".to_string(),
            content: "A very long content that exceeds forty characters limit".to_string(),
            created_at: 0,
            updated_at: 0,
        };
        assert!(note.content_preview().ends_with("..."));
        assert!(note.content_preview().len() <= 43);
    }

    #[test]
    fn test_create_note_validation() {
        let valid = CreateNote::new("Title", "Content");
        assert!(valid.validate().is_ok());

        let empty_title = CreateNote::new("", "Content");
        assert!(empty_title.validate().is_err());

        let empty_content = CreateNote::new("Title", "   ");
        assert!(empty_content.validate().is_err());
    }
}
