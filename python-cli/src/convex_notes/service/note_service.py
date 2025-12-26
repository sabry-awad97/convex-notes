"""Note service for business logic."""

from __future__ import annotations

from collections.abc import Iterator

from convex_notes.entity import CreateNote, Note, UpdateNote
from convex_notes.repository import NoteRepository


class NoteService:
    """Service for note business logic.

    Wraps a repository and provides high-level operations.
    """

    def __init__(self, repository: NoteRepository) -> None:
        """Create a NoteService with the given repository."""
        self._repository = repository

    def list(self) -> list[Note]:
        """List all notes."""
        return self._repository.list()

    def get(self, note_id: str) -> Note | None:
        """Get a note by ID."""
        return self._repository.get(note_id)

    def create(self, title: str, content: str) -> str:
        """Create a new note with validation."""
        note = CreateNote(title=title, content=content)
        return self._repository.create(note)

    def update(self, note_id: str, title: str, content: str) -> None:
        """Update an existing note."""
        note = UpdateNote(id=note_id, title=title, content=content)
        self._repository.update(note)

    def delete(self, note_id: str) -> None:
        """Delete a note by ID."""
        self._repository.delete(note_id)

    def subscribe(self) -> Iterator[list[Note]]:
        """Subscribe to note changes."""
        yield from self._repository.subscribe()
