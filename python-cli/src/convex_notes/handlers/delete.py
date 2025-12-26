"""Delete note handler."""

from rich.console import Console
from rich.prompt import Confirm, Prompt

from convex_notes.service import NoteService

console = Console()


def execute(service: NoteService) -> None:
    """Execute the delete note command."""
    console.print("\n[bold red]🗑️ Delete a note[/bold red]")

    notes = service.list()

    if not notes:
        console.print("[yellow]📭 No notes to delete.[/yellow]")
        return

    # Display notes for selection
    console.print("\nSelect a note to delete:")
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

    if not Confirm.ask(f"Are you sure you want to delete '[yellow]{selected.title}[/yellow]'?"):
        console.print("[yellow]❌ Cancelled.[/yellow]")
        return

    try:
        service.delete(selected.id)
        console.print(f"\n[green]✅[/green] Note '[strike red]{selected.title}[/strike red]' deleted.")
    except Exception as e:
        console.print(f"[red]❌ Failed to delete note:[/red] {e}")
