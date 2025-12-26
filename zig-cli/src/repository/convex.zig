//! Convex HTTP repository implementation.

const std = @import("std");

const note = @import("../entity/note.zig");
const Note = note.Note;
const CreateNote = note.CreateNote;
const UpdateNote = note.UpdateNote;

pub const ConvexError = error{
    ConnectionFailed,
    RequestFailed,
    ParseError,
    ApiError,
    OutOfMemory,
};

/// Convex HTTP Repository.
pub const ConvexRepository = struct {
    allocator: std.mem.Allocator,
    base_url: []const u8,

    pub fn init(allocator: std.mem.Allocator, base_url: []const u8) ConvexRepository {
        return .{
            .allocator = allocator,
            .base_url = base_url,
        };
    }

    /// List all notes.
    pub fn list(self: *ConvexRepository) ![]Note {
        const body = try self.callFunction("query", "notes:list", "{}");
        defer self.allocator.free(body);
        return self.parseNotes(body);
    }

    /// Create a new note.
    pub fn create(self: *ConvexRepository, data: CreateNote) ![]const u8 {
        var args_buf: [512]u8 = undefined;
        const args = std.fmt.bufPrint(&args_buf, "{{\"title\":\"{s}\",\"content\":\"{s}\"}}", .{ data.title, data.content }) catch return ConvexError.ParseError;
        const body = try self.callFunction("mutation", "notes:create", args);
        defer self.allocator.free(body);
        return self.allocator.dupe(u8, "created") catch return ConvexError.OutOfMemory;
    }

    /// Update a note.
    pub fn update(self: *ConvexRepository, data: UpdateNote) !void {
        var args_buf: [512]u8 = undefined;
        const args = std.fmt.bufPrint(&args_buf, "{{\"id\":\"{s}\",\"title\":\"{s}\",\"content\":\"{s}\"}}", .{ data.id, data.title, data.content }) catch return ConvexError.ParseError;
        const body = try self.callFunction("mutation", "notes:update", args);
        self.allocator.free(body);
    }

    /// Delete a note.
    pub fn delete(self: *ConvexRepository, id: []const u8) !void {
        var args_buf: [256]u8 = undefined;
        const args = std.fmt.bufPrint(&args_buf, "{{\"id\":\"{s}\"}}", .{id}) catch return ConvexError.ParseError;
        const body = try self.callFunction("mutation", "notes:remove", args);
        self.allocator.free(body);
    }

    fn callFunction(self: *ConvexRepository, fn_type: []const u8, path: []const u8, args: []const u8) ![]u8 {
        var threaded = std.Io.Threaded.init_single_threaded;
        const io = threaded.io();

        var client = std.http.Client{ .allocator = self.allocator, .io = io };
        defer client.deinit();

        // Build URL
        var url_buf: [256]u8 = undefined;
        const url_str = std.fmt.bufPrint(&url_buf, "{s}/api/{s}", .{ self.base_url, fn_type }) catch return ConvexError.ParseError;

        // Build request body
        var body_buf: [1024]u8 = undefined;
        const request_body = std.fmt.bufPrint(&body_buf, "{{\"path\":\"{s}\",\"args\":{s},\"format\":\"json\"}}", .{ path, args }) catch return ConvexError.ParseError;

        // Create allocating writer for response body
        var response_writer = std.Io.Writer.Allocating.init(self.allocator);

        const result = client.fetch(.{
            .location = .{ .url = url_str },
            .method = .POST,
            .payload = request_body,
            .headers = .{ .content_type = .{ .override = "application/json" } },
            .response_writer = &response_writer.writer,
        }) catch return ConvexError.ConnectionFailed;

        if (result.status != .ok) {
            return ConvexError.ApiError;
        }

        // Get the response body
        return response_writer.toOwnedSlice() catch return ConvexError.OutOfMemory;
    }

    fn parseNotes(self: *ConvexRepository, body: []const u8) ![]Note {
        if (body.len == 0) return &[_]Note{};

        const parsed = std.json.parseFromSlice(std.json.Value, self.allocator, body, .{}) catch return &[_]Note{};
        defer parsed.deinit();

        const value = parsed.value.object.get("value") orelse return &[_]Note{};
        if (value != .array) return &[_]Note{};

        // Count notes first
        const count = value.array.items.len;
        if (count == 0) return &[_]Note{};

        // Allocate slice
        const notes = self.allocator.alloc(Note, count) catch return ConvexError.OutOfMemory;
        var idx: usize = 0;

        for (value.array.items) |item| {
            if (item != .object) continue;

            const obj = item.object;
            const id_val = obj.get("_id") orelse continue;
            const title_val = obj.get("title") orelse continue;
            const content_val = obj.get("content") orelse continue;
            const created_val = obj.get("createdAt") orelse continue;
            const updated_val = obj.get("updatedAt") orelse continue;

            if (id_val != .string or title_val != .string or content_val != .string) continue;

            const created_at: f64 = switch (created_val) {
                .float => |f| f,
                .integer => |i| @floatFromInt(i),
                else => continue,
            };
            const updated_at: f64 = switch (updated_val) {
                .float => |f| f,
                .integer => |i| @floatFromInt(i),
                else => continue,
            };

            notes[idx] = .{
                .id = self.allocator.dupe(u8, id_val.string) catch continue,
                .title = self.allocator.dupe(u8, title_val.string) catch continue,
                .content = self.allocator.dupe(u8, content_val.string) catch continue,
                .created_at = created_at,
                .updated_at = updated_at,
            };
            idx += 1;
        }

        return notes[0..idx];
    }
};
