//! Update note handler.

use anyhow::Result;
use colored::Colorize;
use dialoguer::{Input, Select, theme::ColorfulTheme};

use db::{NoteRepository, NoteService, UpdateNote};

/// Execute the update note command.
pub async fn execute<R: NoteRepository>(service: &NoteService<R>) -> Result<()> {
    println!("\n{}", "📝 Update a note".bright_blue().bold());

    let notes = service.list().await?;

    if notes.is_empty() {
        println!("{}", "📭 No notes to update.".bright_yellow());
        return Ok(());
    }

    let note_titles: Vec<&str> = notes.iter().map(|n| n.title.as_str()).collect();

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Select a note to update")
        .items(&note_titles)
        .interact()?;

    let selected = &notes[selection];

    let title: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("New title")
        .default(selected.title.clone())
        .interact_text()?;

    let content: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("New content")
        .default(selected.content.clone())
        .interact_text()?;

    let update = UpdateNote::new(&selected.id, title, content);

    match service.update(update).await {
        Ok(_) => println!("\n{}", "✅ Note updated successfully!".bright_green()),
        Err(e) => println!("{} {}", "❌ Failed to update note:".bright_red(), e),
    }

    Ok(())
}
