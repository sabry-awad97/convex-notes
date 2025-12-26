//! Application orchestration.

use anyhow::Result;
use colored::Colorize;
use dialoguer::{Select, theme::ColorfulTheme};

use db::{NoteRepository, NoteService};

use crate::handlers;

/// Main application struct.
pub struct App<R: NoteRepository> {
    service: NoteService<R>,
}

impl<R: NoteRepository> App<R> {
    /// Create a new App with the given service.
    pub fn new(service: NoteService<R>) -> Self {
        Self { service }
    }

    /// Run the main application loop.
    pub async fn run(&mut self) -> Result<()> {
        loop {
            let options = vec![
                "📋 List all notes",
                "✏️  Create a new note",
                "📝 Update a note",
                "🗑️  Delete a note",
                "👀 Watch notes (real-time)",
                "🚪 Exit",
            ];

            let selection = Select::with_theme(&ColorfulTheme::default())
                .with_prompt("What would you like to do?")
                .items(&options)
                .default(0)
                .interact()?;

            match selection {
                0 => handlers::list::execute(&self.service).await?,
                1 => handlers::create::execute(&self.service).await?,
                2 => handlers::update::execute(&self.service).await?,
                3 => handlers::delete::execute(&self.service).await?,
                4 => handlers::watch::execute(&self.service).await?,
                5 => {
                    println!("\n{}", "👋 Goodbye!".bright_magenta());
                    break;
                }
                _ => unreachable!(),
            }
            println!();
        }

        Ok(())
    }
}
