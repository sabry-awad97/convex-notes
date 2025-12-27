//! Create note handler.

const std = @import("std");

const service = @import("../service/note.zig");
const NoteService = service.NoteService;
const utils = @import("../utils/zig016.zig");

/// Execute create command.
pub fn execute(svc: *NoteService) void {
    std.debug.print("\x1b[32m\n✏️ Create a new note\x1b[0m\n", .{});

    var buf: [4096]u8 = undefined;

    // Get title
    std.debug.print("Title: ", .{});
    const title_str = utils.readLine(&buf) orelse {
        std.debug.print("\x1b[31m❌ Title is required\x1b[0m\n", .{});
        return;
    };
    if (title_str.len == 0) {
        std.debug.print("\x1b[31m❌ Title is required\x1b[0m\n", .{});
        return;
    }

    // Get content
    std.debug.print("Content: ", .{});
    const content_str = utils.readLine(&buf) orelse {
        std.debug.print("\x1b[31m❌ Content is required\x1b[0m\n", .{});
        return;
    };
    if (content_str.len == 0) {
        std.debug.print("\x1b[31m❌ Content is required\x1b[0m\n", .{});
        return;
    }

    const id = svc.create(title_str, content_str) catch |err| {
        std.debug.print("\x1b[31m❌ Failed to create note: {}\x1b[0m\n", .{err});
        return;
    };

    std.debug.print("\x1b[32m\n✅ Note '{s}' created!\x1b[0m\n", .{title_str});
    std.debug.print("   ID: {s}\n", .{id});
}
