"""List notes handler."""

from rich.console import Console

from convex_notes.service import NoteService
from convex_notes.ui import display_notes

console = Console()


def execute(service: NoteService) -> None:
    """Execute the list notes command."""
    console.print("\n[blue]📋 Fetching notes...[/blue]")

    notes = service.list()

    if not notes:
        console.print("\n[yellow]📭 No notes found. Create your first one![/yellow]")
    else:
        console.print(f"\n[green]Found[/green] [bold white]{len(notes)}[/bold white] note(s)\n")
        display_notes(notes)
