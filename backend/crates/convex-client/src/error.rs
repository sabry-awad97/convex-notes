use thiserror::Error;

/// Errors that can occur when interacting with Convex.
#[derive(Debug, Error)]
pub enum ConvexError {
    #[error("Connection failed: {0}")]
    ConnectionFailed(String),

    #[error("Query failed: {0}")]
    QueryFailed(String),

    #[error("Mutation failed: {0}")]
    MutationFailed(String),

    #[error("Subscription failed: {0}")]
    SubscriptionFailed(String),

    #[error("Unexpected response format")]
    UnexpectedFormat,

    #[error("Convex error: {message}")]
    ConvexApiError { message: String },
}
