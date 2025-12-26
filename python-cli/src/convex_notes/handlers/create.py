"""Create note handler."""

from rich.console import Console
from rich.prompt import Prompt

from convex_notes.service import NoteService

console = Console()


def execute(service: NoteService) -> None:
    """Execute the create note command."""
    console.print("\n[bold green]✏️ Create a new note[/bold green]")

    title = Prompt.ask("[cyan]Title[/cyan]")
    content = Prompt.ask("[cyan]Content[/cyan]")

    if not title.strip() or not content.strip():
        console.print("[red]❌ Title and content are required.[/red]")
        return

    try:
        note_id = service.create(title, content)
        console.print(f"\n[green]✅[/green] Note '[yellow]{title}[/yellow]' created!")
        console.print(f"   [dim]ID:[/dim] {note_id}")
    except Exception as e:
        console.print(f"[red]❌ Failed to create note:[/red] {e}")
