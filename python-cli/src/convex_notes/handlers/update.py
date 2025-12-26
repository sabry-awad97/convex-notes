"""Update note handler."""

from rich.console import Console
from rich.prompt import Prompt

from convex_notes.service import NoteService

console = Console()


def execute(service: NoteService) -> None:
    """Execute the update note command."""
    console.print("\n[bold blue]📝 Update a note[/bold blue]")

    notes = service.list()

    if not notes:
        console.print("[yellow]📭 No notes to update.[/yellow]")
        return

    # Display notes for selection
    console.print("\nSelect a note to update:")
    for i, note in enumerate(notes, 1):
        console.print(f"  [cyan]{i}[/cyan]. {note.title}")

    try:
        choice = int(Prompt.ask("\n[cyan]Enter number[/cyan]")) - 1
        if choice < 0 or choice >= len(notes):
            console.print("[red]❌ Invalid selection.[/red]")
            return
    except ValueError:
        console.print("[red]❌ Invalid input.[/red]")
        return

    selected = notes[choice]

    title = Prompt.ask("[cyan]New title[/cyan]", default=selected.title)
    content = Prompt.ask("[cyan]New content[/cyan]", default=selected.content)

    try:
        service.update(selected.id, title, content)
        console.print("\n[green]✅ Note updated successfully![/green]")
    except Exception as e:
        console.print(f"[red]❌ Failed to update note:[/red] {e}")
