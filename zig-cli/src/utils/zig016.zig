//! Zig 0.16-dev API Utilities
//!
//! This module provides reusable helper functions for Zig 0.16-dev's new I/O APIs.
//! The "Writergate" changes in 0.15/0.16 significantly altered std.io, std.http, etc.

const std = @import("std");
/// Thread-local IO backend to ensure pointers to it remain valid.
threadlocal var threaded_io = std.Io.Threaded.init_single_threaded;

// =============================================================================
// IO BACKEND
// =============================================================================

/// Get the IO interface from the thread-local backend.
pub fn getIo() std.Io {
    return threaded_io.io();
}

// =============================================================================
// STDIN READING
// =============================================================================

/// Get stdin file handle.
/// Usage: `const stdin = getStdin();`
pub fn getStdin() std.fs.File {
    return std.fs.File.stdin();
}

/// Read a line from stdin into a buffer.
/// Returns the trimmed input, or null on EOF/error.
///
/// Example:
/// ```zig
/// var buf: [256]u8 = undefined;
/// if (readLine(&buf)) |line| {
///     std.debug.print("You entered: {s}\n", .{line});
/// }
/// ```
pub fn readLine(buf: []u8) ?[]const u8 {
    var file_reader = createFileReader(getStdin(), buf);

    const input = file_reader.interface.takeDelimiter('\n') catch return null;
    if (input == null) return null;

    return std.mem.trim(u8, input.?, &[_]u8{ '\r', '\n', ' ' });
}

// =============================================================================
// HTTP CLIENT
// =============================================================================

/// HTTP fetch result with body.
pub const FetchResult = struct {
    status: std.http.Status,
    body: []u8,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *FetchResult) void {
        if (self.body.len > 0) {
            self.allocator.free(self.body);
        }
    }
};

/// Perform an HTTP POST request with JSON body.
/// Returns the response body on success.
///
/// Example:
/// ```zig
/// var result = try httpPost(allocator, "http://localhost:3210/api/query", "{\"path\":\"notes:list\"}");
/// defer result.deinit();
/// std.debug.print("Response: {s}\n", .{result.body});
/// ```
pub fn httpPost(allocator: std.mem.Allocator, url: []const u8, json_body: []const u8) !FetchResult {
    const io = getIo();

    var client = std.http.Client{ .allocator = allocator, .io = io };
    defer client.deinit();

    // Create allocating writer for response body
    var response_writer = std.Io.Writer.Allocating.init(allocator);

    const result = try client.fetch(.{
        .location = .{ .url = url },
        .method = .POST,
        .payload = json_body,
        .headers = .{ .content_type = .{ .override = "application/json" } },
        .response_writer = &response_writer.writer,
    });

    const body = try response_writer.toOwnedSlice();

    return .{
        .status = result.status,
        .body = body,
        .allocator = allocator,
    };
}

/// Perform an HTTP GET request.
/// Returns the response body on success.
pub fn httpGet(allocator: std.mem.Allocator, url: []const u8) !FetchResult {
    const io = getIo();

    var client = std.http.Client{ .allocator = allocator, .io = io };
    defer client.deinit();

    var response_writer = std.Io.Writer.Allocating.init(allocator);

    const result = try client.fetch(.{
        .location = .{ .url = url },
        .method = .GET,
        .response_writer = &response_writer.writer,
    });

    const body = try response_writer.toOwnedSlice();

    return .{
        .status = result.status,
        .body = body,
        .allocator = allocator,
    };
}

// =============================================================================
// FILE READING
// =============================================================================

/// Create a file reader with proper Io backend.
/// Returns the file reader struct that has `.interface` for reading.
///
/// Example:
/// ```zig
/// var reader_buf: [4096]u8 = undefined;
/// const file = std.fs.cwd().openFile("test.txt", .{}) catch unreachable;
/// var file_reader = createFileReader(file, &reader_buf);
/// const line = file_reader.interface.takeDelimiter('\n') catch null;
/// ```
pub fn createFileReader(file: std.fs.File, buffer: []u8) std.Io.File.Reader {
    const io = getIo();
    const io_file = std.Io.File{ .handle = file.handle };
    return io_file.reader(io, buffer);
}

// =============================================================================
// JSON HELPERS
// =============================================================================

/// Parsed JSON result that caller must manage.
pub const ParsedJson = struct {
    parsed: std.json.Parsed(std.json.Value),
    allocator: std.mem.Allocator,

    pub fn deinit(self: *ParsedJson) void {
        self.parsed.deinit();
    }

    pub fn getField(self: *ParsedJson, field: []const u8) ?std.json.Value {
        return self.parsed.value.object.get(field);
    }

    pub fn getValue(self: *ParsedJson) std.json.Value {
        return self.parsed.value;
    }
};

/// Parse JSON string into a managed result.
/// Caller must call .deinit() when done.
///
/// Example:
/// ```zig
/// var result = utils.parseJson(allocator, json_string) orelse return;
/// defer result.deinit();
/// if (result.getField("value")) |value| { ... }
/// ```
pub fn parseJson(allocator: std.mem.Allocator, json: []const u8) ?ParsedJson {
    const parsed = std.json.parseFromSlice(std.json.Value, allocator, json, .{}) catch return null;
    return .{ .parsed = parsed, .allocator = allocator };
}
