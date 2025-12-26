//! CLI application entry point.

mod app;
mod handlers;
mod ui;

use anyhow::Result;
use colored::Colorize;

use common::Config;
use convex_client::{ConvexConnection, ConvexNoteRepository};
use db::NoteService;

use app::App;

#[tokio::main]
async fn main() -> Result<()> {
    // Load configuration
    let config = Config::load()?;

    // Print banner
    ui::banner::print();

    // Connect to Convex
    println!(
        "{} Connecting to {}...",
        "🚀".bright_cyan(),
        config.convex_url.bright_yellow()
    );

    let connection = ConvexConnection::connect(&config.convex_url).await?;
    println!("{}\n", "✅ Connected to Convex backend!".bright_green());

    // Set up dependencies (Dependency Injection)
    let repository = ConvexNoteRepository::new(connection);
    let service = NoteService::new(repository);

    // Run the application
    let mut app = App::new(service);
    app.run().await
}
