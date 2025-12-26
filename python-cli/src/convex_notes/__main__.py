"""Entry point for the Convex Notes CLI."""

import os
import sys

from dotenv import load_dotenv
from rich.console import Console

console = Console()


def main() -> None:
    """Main entry point."""
    # Load environment variables
    load_dotenv("../.env.local")
    load_dotenv(".env.local")
    load_dotenv()

    convex_url = os.getenv("CONVEX_URL", "http://127.0.0.1:3210")

    console.print(f"[cyan]🚀[/cyan] Connecting to [yellow]{convex_url}[/yellow]...")

    try:
        run_app(convex_url)
    except KeyboardInterrupt:
        console.print("\n[magenta]👋 Goodbye![/magenta]")
        sys.exit(0)


def run_app(convex_url: str) -> None:
    """Run the application."""
    from convex import ConvexClient

    from convex_notes.app import App
    from convex_notes.repository import ConvexNoteRepository
    from convex_notes.service import NoteService

    # Connect to Convex
    client = ConvexClient(convex_url)
    console.print("[green]✅ Connected to Convex backend![/green]\n")

    # Set up dependencies (Dependency Injection)
    repository = ConvexNoteRepository(client)
    service = NoteService(repository)

    # Run the application
    app = App(service)
    app.run()


if __name__ == "__main__":
    main()
