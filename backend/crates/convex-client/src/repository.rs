use std::collections::BTreeMap;

use anyhow::{Result, anyhow};
use async_trait::async_trait;
use convex::{FunctionResult, Value};
use futures::StreamExt;
use futures::stream::BoxStream;

use db::{CreateNote, Note, NoteRepository, UpdateNote};

use crate::client::ConvexConnection;

/// Convex implementation of the NoteRepository trait.
pub struct ConvexNoteRepository {
    connection: ConvexConnection,
}

impl ConvexNoteRepository {
    /// Create a new repository with the given connection.
    pub fn new(connection: ConvexConnection) -> Self {
        Self { connection }
    }

    /// Extract a successful value from FunctionResult.
    fn extract_value(result: FunctionResult) -> Result<Value> {
        match result {
            FunctionResult::Value(v) => Ok(v),
            FunctionResult::ErrorMessage(msg) => Err(anyhow!("Error: {}", msg)),
            FunctionResult::ConvexError(e) => Err(anyhow!("Convex error: {:?}", e)),
        }
    }

    /// Parse a Value::Object into a Note.
    fn parse_note(obj: &BTreeMap<String, Value>) -> Option<Note> {
        let id = match obj.get("_id") {
            Some(Value::String(s)) => s.clone(),
            _ => return None,
        };
        let title = match obj.get("title") {
            Some(Value::String(s)) => s.clone(),
            _ => return None,
        };
        let content = match obj.get("content") {
            Some(Value::String(s)) => s.clone(),
            _ => String::new(),
        };
        let created_at = match obj.get("createdAt") {
            Some(Value::Float64(n)) => *n as i64,
            Some(Value::Int64(n)) => *n,
            _ => 0,
        };
        let updated_at = match obj.get("updatedAt") {
            Some(Value::Float64(n)) => *n as i64,
            Some(Value::Int64(n)) => *n,
            _ => 0,
        };

        Some(Note {
            id,
            title,
            content,
            created_at,
            updated_at,
        })
    }

    /// Parse an array of notes from a Value.
    fn parse_notes(value: Value) -> Result<Vec<Note>> {
        match value {
            Value::Array(arr) => {
                let notes = arr
                    .iter()
                    .filter_map(|v| {
                        if let Value::Object(obj) = v {
                            Self::parse_note(obj)
                        } else {
                            None
                        }
                    })
                    .collect();
                Ok(notes)
            }
            _ => Err(anyhow!("Expected array of notes")),
        }
    }
}

#[async_trait]
impl NoteRepository for ConvexNoteRepository {
    async fn list(&self) -> Result<Vec<Note>> {
        let mut client = self.connection.write().await;
        let result = client.query("notes:list", maplit::btreemap! {}).await?;
        let value = Self::extract_value(result)?;
        Self::parse_notes(value)
    }

    async fn get(&self, id: &str) -> Result<Option<Note>> {
        let mut client = self.connection.write().await;
        let result = client
            .query(
                "notes:get",
                maplit::btreemap! {
                    "id".into() => Value::String(id.to_string()),
                },
            )
            .await?;

        let value = Self::extract_value(result)?;
        match value {
            Value::Object(obj) => Ok(Self::parse_note(&obj)),
            Value::Null => Ok(None),
            _ => Err(anyhow!("Unexpected response format")),
        }
    }

    async fn create(&self, note: CreateNote) -> Result<String> {
        let mut client = self.connection.write().await;
        let result = client
            .mutation(
                "notes:create",
                maplit::btreemap! {
                    "title".into() => Value::String(note.title),
                    "content".into() => Value::String(note.content),
                },
            )
            .await?;

        let value = Self::extract_value(result)?;
        match value {
            Value::String(id) => Ok(id),
            _ => Err(anyhow!("Expected string ID")),
        }
    }

    async fn update(&self, note: UpdateNote) -> Result<()> {
        let mut client = self.connection.write().await;
        let result = client
            .mutation(
                "notes:update",
                maplit::btreemap! {
                    "id".into() => Value::String(note.id),
                    "title".into() => Value::String(note.title),
                    "content".into() => Value::String(note.content),
                },
            )
            .await?;

        Self::extract_value(result)?;
        Ok(())
    }

    async fn delete(&self, id: &str) -> Result<()> {
        let mut client = self.connection.write().await;
        let result = client
            .mutation(
                "notes:remove",
                maplit::btreemap! {
                    "id".into() => Value::String(id.to_string()),
                },
            )
            .await?;

        Self::extract_value(result)?;
        Ok(())
    }

    async fn subscribe(&self) -> Result<BoxStream<'static, Result<Vec<Note>>>> {
        let mut client = self.connection.write().await;
        let subscription = client.subscribe("notes:list", maplit::btreemap! {}).await?;

        let stream = subscription.map(|result| {
            let value = Self::extract_value(result)?;
            Self::parse_notes(value)
        });

        Ok(Box::pin(stream))
    }
}
