//! Create note handler.

use anyhow::Result;
use colored::Colorize;
use dialoguer::{Input, theme::ColorfulTheme};

use db::{CreateNote, NoteRepository, NoteService};

/// Execute the create note command.
pub async fn execute<R: NoteRepository>(service: &NoteService<R>) -> Result<()> {
    println!("\n{}", "✏️ Create a new note".bright_green().bold());

    let title: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("Title")
        .interact_text()?;

    let content: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("Content")
        .interact_text()?;

    let note = CreateNote::new(title.clone(), content);

    match service.create(note).await {
        Ok(id) => {
            println!(
                "\n{} Note '{}' created!",
                "✅".bright_green(),
                title.bright_yellow()
            );
            println!("   {} {}", "ID:".bright_black(), id);
        }
        Err(e) => println!("{} {}", "❌ Failed to create note:".bright_red(), e),
    }

    Ok(())
}
