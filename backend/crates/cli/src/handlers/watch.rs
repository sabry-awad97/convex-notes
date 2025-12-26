//! Watch notes handler (real-time subscription).

use anyhow::Result;
use colored::Colorize;
use futures::StreamExt;

use db::{NoteRepository, NoteService};

use crate::ui::table;

/// Execute the watch notes command.
pub async fn execute<R: NoteRepository>(service: &NoteService<R>) -> Result<()> {
    println!(
        "\n{}",
        "👀 Watching notes for real-time updates..."
            .bright_magenta()
            .bold()
    );
    println!("{}", "   Press Ctrl+C to stop".bright_black());
    println!();

    let mut stream = service.subscribe().await?;

    while let Some(result) = stream.next().await {
        println!(
            "{} {}",
            "📨".bright_cyan(),
            "Update received:".bright_white()
        );

        match result {
            Ok(notes) => {
                if notes.is_empty() {
                    println!("   {}", "No notes".bright_yellow());
                } else {
                    table::display_notes(&notes);
                }
            }
            Err(e) => println!("   {} {}", "Error:".bright_red(), e),
        }

        println!("{}", "─".repeat(50).bright_black());
    }

    Ok(())
}
