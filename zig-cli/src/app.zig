//! Application orchestration.

const std = @import("std");

const create_handler = @import("handler/create.zig");
const delete_handler = @import("handler/delete.zig");
const list_handler = @import("handler/list.zig");
const service = @import("service/note.zig");
const NoteService = service.NoteService;
const banner = @import("ui/banner.zig");

/// Run the application main loop.
pub fn run(svc: *NoteService) void {
    banner.print();

    const stdin = std.fs.File.stdin();
    var threaded = std.Io.Threaded.init_single_threaded;
    const io = threaded.io();
    var reader_buf: [4096]u8 = undefined;

    while (true) {
        std.debug.print(
            \\What would you like to do?
            \\  1. 📋 List all notes
            \\  2. ✏️  Create a new note
            \\  3. 🗑️  Delete a note
            \\  4. 🚪 Exit
            \\
            \\Enter choice: 
        , .{});

        var file_reader = stdin.reader(io, &reader_buf);
        const input = file_reader.interface.takeDelimiter('\n') catch null;
        if (input == null) break;

        const trimmed = std.mem.trim(u8, input.?, &[_]u8{ '\r', '\n', ' ' });
        const choice = std.fmt.parseInt(u8, trimmed, 10) catch {
            std.debug.print("\x1b[33mInvalid choice. Enter 1-4.\x1b[0m\n\n", .{});
            continue;
        };

        switch (choice) {
            1 => list_handler.execute(svc),
            2 => create_handler.execute(svc),
            3 => delete_handler.execute(svc),
            4 => {
                std.debug.print("\x1b[35m\n👋 Goodbye!\x1b[0m\n", .{});
                break;
            },
            else => std.debug.print("\x1b[33mInvalid choice. Enter 1-4.\x1b[0m\n\n", .{}),
        }

        std.debug.print("\n", .{});
    }
}
