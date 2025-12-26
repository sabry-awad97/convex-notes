//! Common utilities and configuration shared across crates.

mod config;
mod time;

pub use config::Config;
pub use time::format_timestamp;
