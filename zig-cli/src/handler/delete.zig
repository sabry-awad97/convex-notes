//! Delete note handler.

const std = @import("std");

const service = @import("../service/note.zig");
const NoteService = service.NoteService;

/// Execute delete command.
pub fn execute(svc: *NoteService) void {
    std.debug.print("\x1b[31m\n🗑️ Delete a note\x1b[0m\n", .{});

    const notes = svc.list() catch |err| {
        std.debug.print("\x1b[31m❌ Failed to list notes: {}\x1b[0m\n", .{err});
        return;
    };

    if (notes.len == 0) {
        std.debug.print("\x1b[33m📭 No notes to delete.\x1b[0m\n", .{});
        return;
    }

    // Show notes with numbers
    for (notes, 0..) |n, i| {
        std.debug.print("  {d}. {s}\n", .{ i + 1, n.title });
    }

    // Get selection
    std.debug.print("\nEnter number to delete (0 to cancel): ", .{});

    const stdin = std.fs.File.stdin();
    var threaded = std.Io.Threaded.init_single_threaded;
    const io = threaded.io();
    var reader_buf: [4096]u8 = undefined;
    var file_reader = stdin.reader(io, &reader_buf);

    const input = file_reader.interface.takeDelimiter('\n') catch null;
    if (input == null) return;

    const trimmed = std.mem.trim(u8, input.?, &[_]u8{ '\r', '\n', ' ' });
    const idx = std.fmt.parseInt(usize, trimmed, 10) catch {
        std.debug.print("\x1b[33mInvalid selection.\x1b[0m\n", .{});
        return;
    };

    if (idx == 0 or idx > notes.len) {
        std.debug.print("\x1b[33mCancelled.\x1b[0m\n", .{});
        return;
    }

    const selected = notes[idx - 1];

    svc.delete(selected.id) catch |err| {
        std.debug.print("\x1b[31m❌ Failed to delete note: {}\x1b[0m\n", .{err});
        return;
    };

    std.debug.print("\x1b[32m\n✅ Note '{s}' deleted.\x1b[0m\n", .{selected.title});
}
