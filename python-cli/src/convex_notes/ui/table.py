"""Table display for notes."""

from rich.console import Console
from rich.table import Table

from convex_notes.entity import Note

console = Console()


def display_notes(notes: list[Note]) -> None:
    """Display notes in a formatted table."""
    table = Table(
        show_header=True,
        header_style="bold",
        border_style="dim",
    )

    table.add_column("ID", style="cyan", no_wrap=True)
    table.add_column("Title", style="yellow")
    table.add_column("Content", style="white")
    table.add_column("Created", style="magenta")

    for note in notes:
        table.add_row(
            note.short_id,
            note.title,
            note.content_preview,
            note.formatted_created,
        )

    console.print(table)
