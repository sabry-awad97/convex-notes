"""Abstract repository interface using Protocol for structural subtyping."""

from __future__ import annotations

from abc import abstractmethod
from collections.abc import Iterator
from typing import TYPE_CHECKING, Protocol

if TYPE_CHECKING:
    from convex_notes.entity import CreateNote, Note, UpdateNote


class NoteRepository(Protocol):
    """Repository protocol for note data access.

    This defines the contract for note storage operations,
    allowing different implementations (Convex, in-memory, etc.)
    """

    @abstractmethod
    def list(self) -> list[Note]:
        """List all notes."""
        ...

    @abstractmethod
    def get(self, note_id: str) -> Note | None:
        """Get a note by ID."""
        ...

    @abstractmethod
    def create(self, note: CreateNote) -> str:
        """Create a new note. Returns the new note ID."""
        ...

    @abstractmethod
    def update(self, note: UpdateNote) -> None:
        """Update an existing note."""
        ...

    @abstractmethod
    def delete(self, note_id: str) -> None:
        """Delete a note by ID."""
        ...

    @abstractmethod
    def subscribe(self) -> Iterator[list[Note]]:
        """Subscribe to note changes (real-time updates)."""
        ...
