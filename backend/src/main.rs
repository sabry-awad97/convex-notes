use anyhow::{Result, anyhow};
use convex::{ConvexClient, FunctionResult, Value};
use futures::StreamExt;
use std::{
    collections::BTreeMap,
    env,
    io::{self, Write},
};

#[tokio::main]
async fn main() -> Result<()> {
    // Load environment variables
    dotenvy::from_filename("../.env.local").ok();
    dotenvy::dotenv().ok();

    let deployment_url =
        env::var("CONVEX_URL").unwrap_or_else(|_| "http://127.0.0.1:3210".to_string());

    println!("🚀 Connecting to Convex at: {}", deployment_url);

    let mut client = ConvexClient::new(&deployment_url).await?;
    println!("✅ Connected to Convex backend!\n");

    loop {
        print_menu();
        let choice = read_input("Enter your choice: ");

        match choice.trim() {
            "1" => list_notes(&mut client).await?,
            "2" => create_note(&mut client).await?,
            "3" => update_note(&mut client).await?,
            "4" => delete_note(&mut client).await?,
            "5" => watch_notes(&mut client).await?,
            "6" => {
                println!("👋 Goodbye!");
                break;
            }
            _ => println!("❌ Invalid choice. Please try again.\n"),
        }
    }

    Ok(())
}

fn print_menu() {
    println!("╔═══════════════════════════════════╗");
    println!("║     📝 Convex Notes Manager       ║");
    println!("╠═══════════════════════════════════╣");
    println!("║  1. List all notes                ║");
    println!("║  2. Create a new note             ║");
    println!("║  3. Update a note                 ║");
    println!("║  4. Delete a note                 ║");
    println!("║  5. Watch notes (real-time)       ║");
    println!("║  6. Exit                          ║");
    println!("╚═══════════════════════════════════╝");
}

fn read_input(prompt: &str) -> String {
    print!("{}", prompt);
    io::stdout().flush().unwrap();
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    input.trim().to_string()
}

fn get_string_field(obj: &BTreeMap<String, Value>, key: &str) -> String {
    match obj.get(key) {
        Some(Value::String(s)) => s.clone(),
        _ => String::new(),
    }
}

fn extract_value(result: FunctionResult) -> Result<Value> {
    match result {
        FunctionResult::Value(v) => Ok(v),
        FunctionResult::ErrorMessage(msg) => Err(anyhow!("Error: {}", msg)),
        FunctionResult::ConvexError(e) => Err(anyhow!("Convex error: {:?}", e)),
    }
}

fn display_notes(value: &Value) {
    match value {
        Value::Array(notes) => {
            if notes.is_empty() {
                println!("📭 No notes found.");
            } else {
                println!("\n┌─────────────────────────────────────────────────┐");
                for note in notes {
                    if let Value::Object(obj) = note {
                        let id = format!("{:?}", obj.get("_id").unwrap_or(&Value::Null));
                        let title = get_string_field(obj, "title");
                        let content = get_string_field(obj, "content");
                        let content_preview = if content.len() > 40 {
                            format!("{}...", &content[..40])
                        } else {
                            content
                        };
                        println!(
                            "│ 📌 {}",
                            if title.is_empty() { "Untitled" } else { &title }
                        );
                        println!("│    ID: {}", id);
                        println!(
                            "│    {}",
                            if content_preview.is_empty() {
                                "No content"
                            } else {
                                &content_preview
                            }
                        );
                        println!("├─────────────────────────────────────────────────┤");
                    }
                }
                println!("└─────────────────────────────────────────────────┘");
            }
        }
        _ => println!("❌ Unexpected response format"),
    }
}

async fn list_notes(client: &mut ConvexClient) -> Result<()> {
    println!("\n📋 Fetching notes...");

    let result = client.query("notes:list", maplit::btreemap! {}).await?;
    let value = extract_value(result)?;
    display_notes(&value);
    println!();
    Ok(())
}

async fn create_note(client: &mut ConvexClient) -> Result<()> {
    println!("\n✏️ Create a new note:");

    let title = read_input("  Title: ");
    let content = read_input("  Content: ");

    if title.is_empty() || content.is_empty() {
        println!("❌ Title and content are required.\n");
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
            println!("✅ Note '{}' created successfully!", title);
            println!("   ID: {:?}\n", value);
        }
        Err(e) => println!("❌ Failed to create note: {}\n", e),
    }

    Ok(())
}

async fn update_note(client: &mut ConvexClient) -> Result<()> {
    println!("\n📝 Update a note:");

    let id = read_input("  Note ID (copy from list): ");
    let title = read_input("  New title: ");
    let content = read_input("  New content: ");

    if id.is_empty() || title.is_empty() || content.is_empty() {
        println!("❌ All fields are required.\n");
        return Ok(());
    }

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
        Ok(_) => println!("✅ Note updated successfully!\n"),
        Err(e) => println!("❌ Failed to update note: {}\n", e),
    }

    Ok(())
}

async fn delete_note(client: &mut ConvexClient) -> Result<()> {
    println!("\n🗑️ Delete a note:");

    let id = read_input("  Note ID (copy from list): ");

    if id.is_empty() {
        println!("❌ Note ID is required.\n");
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
        Ok(_) => println!("✅ Note deleted successfully!\n"),
        Err(e) => println!("❌ Failed to delete note: {}\n", e),
    }

    Ok(())
}

async fn watch_notes(client: &mut ConvexClient) -> Result<()> {
    println!("\n👀 Watching notes for real-time updates...");
    println!("   (Press Ctrl+C to stop)\n");

    let mut subscription = client.subscribe("notes:list", maplit::btreemap! {}).await?;

    while let Some(result) = subscription.next().await {
        println!("📨 Update received:");
        match result {
            FunctionResult::Value(value) => display_notes(&value),
            FunctionResult::ErrorMessage(msg) => println!("❌ Error: {}", msg),
            FunctionResult::ConvexError(e) => println!("❌ Convex error: {:?}", e),
        }
        println!("─────────────────────────────────────────────────");
    }

    Ok(())
}
