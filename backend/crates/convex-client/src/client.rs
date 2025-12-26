use anyhow::Result;
use convex::ConvexClient;
use std::sync::Arc;
use tokio::sync::RwLock;

use crate::ConvexError;

/// A thread-safe wrapper around the Convex client.
pub struct ConvexConnection {
    client: Arc<RwLock<ConvexClient>>,
    url: String,
}

impl ConvexConnection {
    /// Connect to a Convex backend.
    pub async fn connect(url: &str) -> Result<Self> {
        let client = ConvexClient::new(url)
            .await
            .map_err(|e| ConvexError::ConnectionFailed(e.to_string()))?;

        Ok(Self {
            client: Arc::new(RwLock::new(client)),
            url: url.to_string(),
        })
    }

    /// Get the Convex URL.
    pub fn url(&self) -> &str {
        &self.url
    }

    /// Get a read lock on the client.
    pub async fn read(&self) -> tokio::sync::RwLockReadGuard<'_, ConvexClient> {
        self.client.read().await
    }

    /// Get a write lock on the client.
    pub async fn write(&self) -> tokio::sync::RwLockWriteGuard<'_, ConvexClient> {
        self.client.write().await
    }
}

impl Clone for ConvexConnection {
    fn clone(&self) -> Self {
        Self {
            client: Arc::clone(&self.client),
            url: self.url.clone(),
        }
    }
}
