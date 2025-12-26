//! Delete note handler.

use anyhow::Result;
use colored::Colorize;
use dialoguer::{Confirm, Select, theme::ColorfulTheme};

use db::{NoteRepository, NoteService};

/// Execute the delete note command.
pub async fn execute<R: NoteRepository>(service: &NoteService<R>) -> Result<()> {
    println!("\n{}", "🗑️ Delete a note".bright_red().bold());

    let notes = service.list().await?;

    if notes.is_empty() {
        println!("{}", "📭 No notes to delete.".bright_yellow());
        return Ok(());
    }

    let note_titles: Vec<&str> = notes.iter().map(|n| n.title.as_str()).collect();

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Select a note to delete")
        .items(&note_titles)
        .interact()?;

    let selected = &notes[selection];

    let confirm = Confirm::with_theme(&ColorfulTheme::default())
        .with_prompt(format!(
            "Are you sure you want to delete '{}'?",
            selected.title.bright_yellow()
        ))
        .default(false)
        .interact()?;

    if !confirm {
        println!("{}", "❌ Cancelled.".bright_yellow());
        return Ok(());
    }

    match service.delete(&selected.id).await {
        Ok(_) => println!(
            "\n{} Note '{}' deleted.",
            "✅".bright_green(),
            selected.title.bright_red().strikethrough()
        ),
        Err(e) => println!("{} {}", "❌ Failed to delete note:".bright_red(), e),
    }

    Ok(())
}
