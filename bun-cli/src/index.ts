/**
 * Entry point for the Convex Notes CLI.
 */

import pc from "picocolors";
import { run } from "./app";
import { ConvexNoteRepository } from "./repository/convex";
import { NoteService } from "./service/note-service";

const CONVEX_URL = process.env.CONVEX_URL ?? "http://127.0.0.1:3210";

console.log(pc.cyan("🚀") + ` Connecting to ${pc.yellow(CONVEX_URL)}...`);

// Set up dependencies (Dependency Injection)
const repository = new ConvexNoteRepository(CONVEX_URL);
const service = new NoteService(repository);

console.log(pc.green("✅ Connected to Convex backend!\n"));

// Run the application
await run(service);
