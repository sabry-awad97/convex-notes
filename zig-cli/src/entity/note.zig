//! Note entity types.

const std = @import("std");

/// Represents a stored note.
pub const Note = struct {
    id: []const u8,
    title: []const u8,
    content: []const u8,
    created_at: f64,
    updated_at: f64,

    /// Returns a short ID for display (max 12 chars).
    pub fn shortId(self: Note) []const u8 {
        return if (self.id.len > 12) self.id[0..12] else self.id;
    }

    /// Returns a content preview (max 40 chars).
    pub fn contentPreview(self: Note) []const u8 {
        return if (self.content.len > 40) self.content[0..40] else self.content;
    }

    /// Returns formatted timestamp (simplified).
    pub fn formattedCreated(self: Note, buf: []u8) []const u8 {
        const timestamp_ms: i64 = @intFromFloat(self.created_at);
        const epoch_seconds: u64 = @intCast(@divTrunc(timestamp_ms, 1000));
        // Simple formatting - just show seconds since epoch for now
        return std.fmt.bufPrint(buf, "{d}", .{epoch_seconds}) catch "?";
    }
};

/// Data for creating a note.
pub const CreateNote = struct {
    title: []const u8,
    content: []const u8,
};

/// Data for updating a note.
pub const UpdateNote = struct {
    id: []const u8,
    title: []const u8,
    content: []const u8,
};
