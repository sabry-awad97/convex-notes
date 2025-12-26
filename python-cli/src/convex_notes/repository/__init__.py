"""Repository layer for data access abstraction."""

from convex_notes.repository.base import NoteRepository
from convex_notes.repository.convex import ConvexNoteRepository

__all__ = ["NoteRepository", "ConvexNoteRepository"]
