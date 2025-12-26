//! Banner UI component.

const std = @import("std");

/// Print the application banner.
pub fn print() void {
    const cyan = "\x1b[36m";
    const white_bold = "\x1b[1;37m";
    const dim = "\x1b[2m";
    const reset = "\x1b[0m";

    std.debug.print("{s}╔══════════════════════════════════════════════════════════╗{s}\n", .{ cyan, reset });
    std.debug.print("{s}║{s}{s}           📝 CONVEX NOTES MANAGER                        {s}{s}║{s}\n", .{ cyan, reset, white_bold, reset, cyan, reset });
    std.debug.print("{s}║{s}{s}         Self-Hosted • Zig Client • v0.1.0               {s}{s}║{s}\n", .{ cyan, reset, dim, reset, cyan, reset });
    std.debug.print("{s}╚══════════════════════════════════════════════════════════╝{s}\n\n", .{ cyan, reset });
}
