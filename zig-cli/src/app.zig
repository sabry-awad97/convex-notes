//! Application orchestration.

const std = @import("std");

const create_handler = @import("handler/create.zig");
const delete_handler = @import("handler/delete.zig");
const list_handler = @import("handler/list.zig");
const service = @import("service/note.zig");
const NoteService = service.NoteService;
const banner = @import("ui/banner.zig");
const utils = @import("utils/zig016.zig");

/// Run the application main loop.
pub fn run(svc: *NoteService) void {
    banner.print();

    var buf: [4096]u8 = undefined;

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

        const input = utils.readLine(&buf) orelse break;

        const choice = std.fmt.parseInt(u8, input, 10) catch {
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
