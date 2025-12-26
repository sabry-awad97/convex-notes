//! Note service for business logic.

const std = @import("std");

const note = @import("../entity/note.zig");
const Note = note.Note;
const convex = @import("../repository/convex.zig");
const ConvexRepository = convex.ConvexRepository;

/// Note service wrapping repository.
pub const NoteService = struct {
    repo: *ConvexRepository,

    pub fn init(repo: *ConvexRepository) NoteService {
        return .{ .repo = repo };
    }

    pub fn list(self: *NoteService) ![]Note {
        return self.repo.list();
    }

    pub fn create(self: *NoteService, title: []const u8, content: []const u8) ![]const u8 {
        return self.repo.create(.{ .title = title, .content = content });
    }

    pub fn update(self: *NoteService, id: []const u8, title: []const u8, content: []const u8) !void {
        return self.repo.update(.{ .id = id, .title = title, .content = content });
    }

    pub fn delete(self: *NoteService, id: []const u8) !void {
        return self.repo.delete(id);
    }
};
