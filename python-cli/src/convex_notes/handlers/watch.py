"""Watch notes handler (real-time subscription)."""

from rich.console import Console

from convex_notes.service import NoteService
from convex_notes.ui import display_notes

console = Console()


def execute(service: NoteService) -> None:
    """Execute the watch notes command."""
    console.print("\n[bold magenta]👀 Watching notes for real-time updates...[/bold magenta]")
    console.print("[dim]   Press Ctrl+C to stop[/dim]\n")

    try:
        for notes in service.subscribe():
            console.print("[cyan]📨[/cyan] [white]Update received:[/white]")
            if not notes:
                console.print("   [yellow]No notes[/yellow]")
            else:
                display_notes(notes)
            console.print("[dim]" + "─" * 50 + "[/dim]")
    except KeyboardInterrupt:
        console.print("\n[magenta]👋 Stopped watching.[/magenta]")
