"""Note entity models."""

from datetime import datetime
from typing import Self

from pydantic import BaseModel, Field


class Note(BaseModel):
    """A note entity representing a stored note."""

    id: str = Field(description="Unique identifier")
    title: str = Field(description="Note title")
    content: str = Field(description="Note content")
    created_at: int = Field(description="Creation timestamp (Unix milliseconds)")
    updated_at: int = Field(description="Last update timestamp (Unix milliseconds)")

    @property
    def short_id(self) -> str:
        """Get a short ID for display (first 12 chars)."""
        return self.id[:12] if len(self.id) > 12 else self.id

    @property
    def content_preview(self) -> str:
        """Get a content preview (max 40 chars)."""
        if len(self.content) > 40:
            return f"{self.content[:40]}..."
        return self.content

    @property
    def created_datetime(self) -> datetime:
        """Get creation time as datetime."""
        return datetime.fromtimestamp(self.created_at / 1000)

    @property
    def formatted_created(self) -> str:
        """Get formatted creation date string."""
        return self.created_datetime.strftime("%Y-%m-%d %H:%M")

    @classmethod
    def from_convex(cls, data: dict) -> Self:
        """Create a Note from Convex response data."""
        return cls(
            id=data.get("_id", ""),
            title=data.get("title", ""),
            content=data.get("content", ""),
            created_at=int(data.get("createdAt", 0)),
            updated_at=int(data.get("updatedAt", 0)),
        )


class CreateNote(BaseModel):
    """Data for creating a new note."""

    title: str = Field(min_length=1, description="Note title")
    content: str = Field(min_length=1, description="Note content")


class UpdateNote(BaseModel):
    """Data for updating an existing note."""

    id: str = Field(description="Note ID to update")
    title: str = Field(min_length=1, description="New title")
    content: str = Field(min_length=1, description="New content")
