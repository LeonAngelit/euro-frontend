import { describe, it, expect } from "vitest";
import { Note } from "../src/notes.js";

describe("Note", () => {
  it("creates a new note with incremental ID", () => {
    const existing = [
      { id: 1, title: "a", body: "b", created_at: "2026-01-01T00:00:00Z" },
      { id: 2, title: "c", body: "d", created_at: "2026-01-01T00:00:01Z" },
    ];
    const note = Note.new("new", "body", existing);
    expect(note.id).toBe(3);
    expect(note.title).toBe("new");
    expect(note.body).toBe("body");
    expect(note.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it("generates ID 1 if no existing notes", () => {
    const note = Note.new("first", "body", []);
    expect(note.id).toBe(1);
  });

  it("serializes to dict correctly", () => {
    const note = new Note(42, "t", "b", "2026-05-15T10:00:00Z");
    expect(note.toDict()).toEqual({
      id: 42,
      title: "t",
      body: "b",
      created_at: "2026-05-15T10:00:00Z",
    });
  });
});
