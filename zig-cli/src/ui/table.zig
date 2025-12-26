//! Table display for notes.

const std = @import("std");

const note = @import("../entity/note.zig");
const Note = note.Note;

/// Display notes in a table format.
pub fn display(notes: []const Note) void {
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const magenta = "\x1b[35m";
    const reset = "\x1b[0m";
    const dim = "\x1b[2m";

    if (notes.len == 0) {
        std.debug.print("{s}📭 No notes found.{s}\n", .{ yellow, reset });
        return;
    }

    // Header
    std.debug.print("\n{s}{s:<14}{s}{s:<20}{s}{s:<45}{s}{s}{s}\n", .{
        cyan, "ID", yellow, "Title", reset, "Content", magenta, "Created", reset,
    });
    std.debug.print("{s}───────────────────────────────────────────────────────────────────────────────────────────────{s}\n", .{ dim, reset });

    // Rows
    var time_buf: [20]u8 = undefined;
    for (notes) |n| {
        std.debug.print("{s}{s:<14}{s}{s:<20}{s}{s:<45}{s}{s}{s}\n", .{
            cyan,
            n.shortId(),
            yellow,
            truncate(n.title, 18),
            reset,
            n.contentPreview(),
            magenta,
            n.formattedCreated(&time_buf),
            reset,
        });
    }
    std.debug.print("\n", .{});
}

fn truncate(s: []const u8, max: usize) []const u8 {
    return if (s.len > max) s[0..max] else s;
}
