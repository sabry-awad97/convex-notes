//! Create note handler.

const std = @import("std");

const service = @import("../service/note.zig");
const NoteService = service.NoteService;

/// Execute create command.
pub fn execute(svc: *NoteService) void {
    std.debug.print("\x1b[32m\n✏️ Create a new note\x1b[0m\n", .{});

    const stdin = std.fs.File.stdin();
    var threaded = std.Io.Threaded.init_single_threaded;
    const io = threaded.io();
    var reader_buf: [4096]u8 = undefined;
    var file_reader = stdin.reader(io, &reader_buf);

    // Get title
    std.debug.print("Title: ", .{});
    const title = file_reader.interface.takeDelimiter('\n') catch null;
    if (title == null or title.?.len == 0) {
        std.debug.print("\x1b[31m❌ Title is required\x1b[0m\n", .{});
        return;
    }
    const title_str = std.mem.trim(u8, title.?, &[_]u8{ '\r', '\n' });

    // Get content
    std.debug.print("Content: ", .{});
    const content = file_reader.interface.takeDelimiter('\n') catch null;
    if (content == null or content.?.len == 0) {
        std.debug.print("\x1b[31m❌ Content is required\x1b[0m\n", .{});
        return;
    }
    const content_str = std.mem.trim(u8, content.?, &[_]u8{ '\r', '\n' });

    const id = svc.create(title_str, content_str) catch |err| {
        std.debug.print("\x1b[31m❌ Failed to create note: {}\x1b[0m\n", .{err});
        return;
    };

    std.debug.print("\x1b[32m\n✅ Note '{s}' created!\x1b[0m\n", .{title_str});
    std.debug.print("   ID: {s}\n", .{id});
}
