//! Convex Notes CLI - Zig client with clean architecture.

const std = @import("std");

const app = @import("app.zig");
const convex = @import("repository/convex.zig");
const service = @import("service/note.zig");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Default URL
    const url = "http://127.0.0.1:3210";

    std.debug.print("\x1b[36m🚀\x1b[0m Connecting to \x1b[33m{s}\x1b[0m...\n", .{url});
    std.debug.print("\x1b[32m✅ Ready!\x1b[0m\n\n", .{});

    // Set up dependencies (Dependency Injection)
    var repo = convex.ConvexRepository.init(allocator, url);
    var svc = service.NoteService.init(&repo);

    // Run the application
    app.run(&svc);
}
