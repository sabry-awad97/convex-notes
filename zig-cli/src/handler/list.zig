//! List notes handler.

const std = @import("std");

const service = @import("../service/note.zig");
const NoteService = service.NoteService;
const table = @import("../ui/table.zig");

/// Execute list command.
pub fn execute(svc: *NoteService) void {
    std.debug.print("\x1b[34m\n📋 Fetching notes...\x1b[0m\n", .{});

    const notes = svc.list() catch |err| {
        std.debug.print("\x1b[31m❌ Failed to list notes: {}\x1b[0m\n", .{err});
        return;
    };

    if (notes.len == 0) {
        std.debug.print("\x1b[33m\n📭 No notes found. Create your first one!\x1b[0m\n", .{});
    } else {
        std.debug.print("\x1b[32m\nFound {d} note(s)\x1b[0m\n", .{notes.len});
        table.display(notes);
    }
}
