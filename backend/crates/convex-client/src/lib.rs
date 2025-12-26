//! Convex client implementation of the repository pattern.
//!
//! This crate provides a Convex-specific implementation of `NoteRepository`.

mod client;
mod error;
mod repository;

pub use client::ConvexConnection;
pub use error::ConvexError;
pub use repository::ConvexNoteRepository;
