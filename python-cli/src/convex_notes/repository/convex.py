"""Convex implementation of the NoteRepository."""

from __future__ import annotations

from typing import TYPE_CHECKING, Iterator

from convex import ConvexClient

from convex_notes.entity import Note

if TYPE_CHECKING:
    from convex_notes.entity import CreateNote, UpdateNote


class ConvexNoteRepository:
    """Convex implementation of the NoteRepository protocol."""

    def __init__(self, client: ConvexClient) -> None:
        """Initialize with a Convex client."""
        self._client = client

    def list(self) -> list[Note]:
        """List all notes from Convex."""
        result = self._client.query("notes:list", {})
        return [Note.from_convex(item) for item in result]

    def get(self, note_id: str) -> Note | None:
        """Get a note by ID from Convex."""
        result = self._client.query("notes:get", {"id": note_id})
        if result is None:
            return None
        return Note.from_convex(result)

    def create(self, note: CreateNote) -> str:
        """Create a new note in Convex."""
        result = self._client.mutation(
            "notes:create",
            {"title": note.title, "content": note.content},
        )
        return str(result)

    def update(self, note: UpdateNote) -> None:
        """Update an existing note in Convex."""
        self._client.mutation(
            "notes:update",
            {"id": note.id, "title": note.title, "content": note.content},
        )

    def delete(self, note_id: str) -> None:
        """Delete a note from Convex."""
        self._client.mutation("notes:remove", {"id": note_id})

    def subscribe(self) -> Iterator[list[Note]]:
        """Subscribe to note changes from Convex."""
        for result in self._client.subscribe("notes:list", {}):
            yield [Note.from_convex(item) for item in result]
