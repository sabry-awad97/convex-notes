//! Database layer with entity, repository, and service abstractions.
//!
//! This crate follows the repository pattern for clean separation of concerns:
//! - `entity` - Domain models
//! - `repository` - Data access traits
//! - `service` - Business logic

pub mod entity;
pub mod repository;
pub mod service;

pub use entity::*;
pub use repository::*;
pub use service::*;
