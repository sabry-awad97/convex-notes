"""Application orchestration."""

from rich.console import Console
from rich.prompt import Prompt

from convex_notes.handlers import create, delete, list_notes, update, watch
from convex_notes.service import NoteService
from convex_notes.ui import print_banner

console = Console()


class App:
    """Main application class."""

    MENU_OPTIONS = [
        ("1", "📋 List all notes", list_notes.execute),
        ("2", "✏️  Create a new note", create.execute),
        ("3", "📝 Update a note", update.execute),
        ("4", "🗑️  Delete a note", delete.execute),
        ("5", "👀 Watch notes (real-time)", watch.execute),
        ("6", "🚪 Exit", None),
    ]

    def __init__(self, service: NoteService) -> None:
        """Create an App with the given service."""
        self._service = service

    def run(self) -> None:
        """Run the main application loop."""
        print_banner()

        while True:
            self._display_menu()

            choice = Prompt.ask("\n[cyan]Select an option[/cyan]", default="1")

            handler = self._get_handler(choice)
            if handler is None:
                console.print("\n[magenta]👋 Goodbye![/magenta]")
                break

            try:
                handler(self._service)
            except KeyboardInterrupt:
                pass
            except Exception as e:
                console.print(f"\n[red]Error:[/red] {e}")

            console.print()

    def _display_menu(self) -> None:
        """Display the menu options."""
        console.print("\n[bold]What would you like to do?[/bold]")
        for key, label, _ in self.MENU_OPTIONS:
            console.print(f"  [cyan]{key}[/cyan]. {label}")

    def _get_handler(self, choice: str):
        """Get the handler for the given choice."""
        for key, _, handler in self.MENU_OPTIONS:
            if key == choice:
                return handler
        return None
