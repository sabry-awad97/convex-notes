"""Application banner."""

from rich.console import Console
from rich.panel import Panel
from rich.text import Text

console = Console()


def print_banner() -> None:
    """Print the application banner."""
    title = Text()
    title.append("📝 CONVEX NOTES MANAGER", style="bold white")

    subtitle = Text()
    subtitle.append("Self-Hosted • Python Client • v0.1.0", style="dim")

    content = Text.assemble(title, "\n", subtitle)

    panel = Panel(
        content,
        border_style="cyan",
        padding=(1, 4),
    )

    console.print()
    console.print(panel)
    console.print()
