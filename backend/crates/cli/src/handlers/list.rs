//! List notes handler.

use anyhow::Result;
use colored::Colorize;

use db::{NoteRepository, NoteService};

use crate::ui::table;

/// Execute the list notes command.
pub async fn execute<R: NoteRepository>(service: &NoteService<R>) -> Result<()> {
    println!("\n{}", "📋 Fetching notes...".bright_blue());

    let notes = service.list().await?;

    if notes.is_empty() {
        println!(
            "\n{}",
            "📭 No notes found. Create your first one!".bright_yellow()
        );
    } else {
        println!(
            "\n{} {} note(s)\n",
            "Found".bright_green(),
            notes.len().to_string().bright_white().bold()
        );
        table::display_notes(&notes);
    }

    Ok(())
}
