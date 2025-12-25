use anyhow::{anyhow, Result};
use chrono::{DateTime, Local, TimeZone};
use colored::Colorize;
use convex::{ConvexClient, FunctionResult, Value};
use dialoguer::{theme::ColorfulTheme, Confirm, Input, Select};
use envconfig::Envconfig;
use futures::StreamExt;
use prettytable::{format, Cell, Row, Table};
use std::collections::BTreeMap;

#[derive(Envconfig)]
struct Config {
    #[envconfig(from = "CONVEX_URL", default = "http://127.0.0.1:3210")]
    convex_url: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Load environment variables
    dotenvy::from_filename("../.env.local").ok();
    dotenvy::dotenv().ok();

    let config = Config::init_from_env()?;

    print_banner();
    println!(
        "{} Connecting to {}...",
        "🚀".bright_cyan(),
        config.convex_url.bright_yellow()
    );

    let mut client = ConvexClient::new(&config.convex_url).await?;
    println!("{}\n", "✅ Connected to Convex backend!".bright_green());

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
            0 => list_notes(&mut client).await?,
            1 => create_note(&mut client).await?,
            2 => update_note(&mut client).await?,
            3 => delete_note(&mut client).await?,
            4 => watch_notes(&mut client).await?,
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

fn print_banner() {
    println!();
    println!(
        "{}",
        "╔══════════════════════════════════════════════════════════╗".bright_cyan()
    );
    println!(
        "{}",
        "║                                                          ║".bright_cyan()
    );
    println!(
        "{}{}{}",
        "║".bright_cyan(),
        "           📝 CONVEX NOTES MANAGER                      "
            .bright_white()
            .bold(),
        "║".bright_cyan()
    );
    println!(
        "{}{}{}",
        "║".bright_cyan(),
        "         Self-Hosted • Rust Client • v0.1.0             ".bright_black(),
        "║".bright_cyan()
    );
    println!(
        "{}",
        "║                                                          ║".bright_cyan()
    );
    println!(
        "{}",
        "╚══════════════════════════════════════════════════════════╝".bright_cyan()
    );
    println!();
}

fn get_string_field(obj: &BTreeMap<String, Value>, key: &str) -> String {
    match obj.get(key) {
        Some(Value::String(s)) => s.clone(),
        _ => String::new(),
    }
}

fn get_number_field(obj: &BTreeMap<String, Value>, key: &str) -> i64 {
    match obj.get(key) {
        Some(Value::Float64(n)) => *n as i64,
        Some(Value::Int64(n)) => *n,
        _ => 0,
    }
}

fn format_timestamp(ts: i64) -> String {
    Local
        .timestamp_millis_opt(ts)
        .single()
        .map(|dt: DateTime<Local>| dt.format("%Y-%m-%d %H:%M").to_string())
        .unwrap_or_else(|| "Unknown".to_string())
}

fn extract_value(result: FunctionResult) -> Result<Value> {
    match result {
        FunctionResult::Value(v) => Ok(v),
        FunctionResult::ErrorMessage(msg) => Err(anyhow!("Error: {}", msg)),
        FunctionResult::ConvexError(e) => Err(anyhow!("Convex error: {:?}", e)),
    }
}

fn display_notes_table(notes: &[Value]) {
    let mut table = Table::new();
    table.set_format(*format::consts::FORMAT_BOX_CHARS);

    table.add_row(Row::new(vec![
        Cell::new("ID").style_spec("bFc"),
        Cell::new("Title").style_spec("bFy"),
        Cell::new("Content").style_spec("bFw"),
        Cell::new("Created").style_spec("bFm"),
    ]));

    for note in notes {
        if let Value::Object(obj) = note {
            let id = get_string_field(obj, "_id");
            let short_id = if id.len() > 12 { &id[..12] } else { &id };
            let title = get_string_field(obj, "title");
            let content = get_string_field(obj, "content");
            let content_preview = if content.len() > 40 {
                format!("{}...", &content[..40])
            } else {
                content
            };
            let created = format_timestamp(get_number_field(obj, "createdAt"));

            table.add_row(Row::new(vec![
                Cell::new(short_id).style_spec("Fc"),
                Cell::new(&title).style_spec("Fy"),
                Cell::new(&content_preview),
                Cell::new(&created).style_spec("Fm"),
            ]));
        }
    }

    table.printstd();
}

async fn list_notes(client: &mut ConvexClient) -> Result<()> {
    println!("\n{}", "📋 Fetching notes...".bright_blue());

    let result = client.query("notes:list", maplit::btreemap! {}).await?;
    let value = extract_value(result)?;

    match value {
        Value::Array(notes) => {
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
                display_notes_table(&notes);
            }
        }
        _ => println!("{}", "❌ Unexpected response format".bright_red()),
    }

    Ok(())
}

async fn create_note(client: &mut ConvexClient) -> Result<()> {
    println!("\n{}", "✏️ Create a new note".bright_green().bold());

    let title: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("Title")
        .interact_text()?;

    let content: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("Content")
        .interact_text()?;

    // Or use editor for longer content
    // let content = Editor::new().edit("Enter your note content...")?.unwrap_or_default();

    if title.is_empty() || content.is_empty() {
        println!("{}", "❌ Title and content are required.".bright_red());
        return Ok(());
    }

    let result = client
        .mutation(
            "notes:create",
            maplit::btreemap! {
                "title".into() => Value::String(title.clone()),
                "content".into() => Value::String(content),
            },
        )
        .await?;

    match extract_value(result) {
        Ok(value) => {
            println!(
                "\n{} Note '{}' created!",
                "✅".bright_green(),
                title.bright_yellow()
            );
            println!("   {} {:?}", "ID:".bright_black(), value);
        }
        Err(e) => println!("{} {}", "❌ Failed to create note:".bright_red(), e),
    }

    Ok(())
}

async fn update_note(client: &mut ConvexClient) -> Result<()> {
    println!("\n{}", "📝 Update a note".bright_blue().bold());

    // First, list notes to pick from
    let result = client.query("notes:list", maplit::btreemap! {}).await?;
    let value = extract_value(result)?;

    let notes = match value {
        Value::Array(notes) if !notes.is_empty() => notes,
        _ => {
            println!("{}", "📭 No notes to update.".bright_yellow());
            return Ok(());
        }
    };

    let note_titles: Vec<String> = notes
        .iter()
        .filter_map(|n| {
            if let Value::Object(obj) = n {
                Some(get_string_field(obj, "title"))
            } else {
                None
            }
        })
        .collect();

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Select a note to update")
        .items(&note_titles)
        .interact()?;

    let selected_note = &notes[selection];
    let (id, old_title, old_content) = if let Value::Object(obj) = selected_note {
        (
            get_string_field(obj, "_id"),
            get_string_field(obj, "title"),
            get_string_field(obj, "content"),
        )
    } else {
        return Ok(());
    };

    let title: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("New title")
        .default(old_title)
        .interact_text()?;

    let content: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("New content")
        .default(old_content)
        .interact_text()?;

    let result = client
        .mutation(
            "notes:update",
            maplit::btreemap! {
                "id".into() => Value::String(id),
                "title".into() => Value::String(title),
                "content".into() => Value::String(content),
            },
        )
        .await?;

    match extract_value(result) {
        Ok(_) => println!("\n{}", "✅ Note updated successfully!".bright_green()),
        Err(e) => println!("{} {}", "❌ Failed to update note:".bright_red(), e),
    }

    Ok(())
}

async fn delete_note(client: &mut ConvexClient) -> Result<()> {
    println!("\n{}", "🗑️ Delete a note".bright_red().bold());

    // First, list notes to pick from
    let result = client.query("notes:list", maplit::btreemap! {}).await?;
    let value = extract_value(result)?;

    let notes = match value {
        Value::Array(notes) if !notes.is_empty() => notes,
        _ => {
            println!("{}", "📭 No notes to delete.".bright_yellow());
            return Ok(());
        }
    };

    let note_titles: Vec<String> = notes
        .iter()
        .filter_map(|n| {
            if let Value::Object(obj) = n {
                Some(get_string_field(obj, "title"))
            } else {
                None
            }
        })
        .collect();

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Select a note to delete")
        .items(&note_titles)
        .interact()?;

    let selected_note = &notes[selection];
    let (id, title) = if let Value::Object(obj) = selected_note {
        (get_string_field(obj, "_id"), get_string_field(obj, "title"))
    } else {
        return Ok(());
    };

    let confirm = Confirm::with_theme(&ColorfulTheme::default())
        .with_prompt(format!(
            "Are you sure you want to delete '{}'?",
            title.bright_yellow()
        ))
        .default(false)
        .interact()?;

    if !confirm {
        println!("{}", "❌ Cancelled.".bright_yellow());
        return Ok(());
    }

    let result = client
        .mutation(
            "notes:remove",
            maplit::btreemap! {
                "id".into() => Value::String(id),
            },
        )
        .await?;

    match extract_value(result) {
        Ok(_) => println!(
            "\n{} Note '{}' deleted.",
            "✅".bright_green(),
            title.bright_red().strikethrough()
        ),
        Err(e) => println!("{} {}", "❌ Failed to delete note:".bright_red(), e),
    }

    Ok(())
}

async fn watch_notes(client: &mut ConvexClient) -> Result<()> {
    println!(
        "\n{}",
        "👀 Watching notes for real-time updates..."
            .bright_magenta()
            .bold()
    );
    println!("{}", "   Press Ctrl+C to stop".bright_black());
    println!();

    let mut subscription = client.subscribe("notes:list", maplit::btreemap! {}).await?;

    while let Some(result) = subscription.next().await {
        println!(
            "{} {}",
            "📨".bright_cyan(),
            "Update received:".bright_white()
        );
        match result {
            FunctionResult::Value(Value::Array(notes)) => {
                if notes.is_empty() {
                    println!("   {}", "No notes".bright_yellow());
                } else {
                    display_notes_table(&notes);
                }
            }
            FunctionResult::Value(_) => println!("   {}", "Unexpected format".bright_yellow()),
            FunctionResult::ErrorMessage(msg) => println!("   {} {}", "Error:".bright_red(), msg),
            FunctionResult::ConvexError(e) => {
                println!("   {} {:?}", "Convex error:".bright_red(), e)
            }
        }
        println!("{}", "─".repeat(50).bright_black());
    }

    Ok(())
}
