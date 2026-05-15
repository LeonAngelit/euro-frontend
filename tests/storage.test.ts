import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import * as storage from "../src/storage.js";

const TEST_FILE = ".test_notes.json";

describe("storage", () => {
  beforeEach(async () => {
    try {
      await fs.unlink(TEST_FILE);
    } catch {
      // Ignore if not exists
    }
  });

  afterEach(async () => {
    try {
      await fs.unlink(TEST_FILE);
    } catch {
      // Ignore
    }
  });

  it("load() returns empty array if file does not exist", async () => {
    const notes = await storage.load(TEST_FILE);
    expect(notes).toEqual([]);
  });

  it("save() creates the file and load() reads it back", async () => {
    const data = [
      { id: 1, title: "t1", body: "b1", created_at: "2026-05-15T10:00:00Z" },
    ];
    await storage.save(data, TEST_FILE);
    const loaded = await storage.load(TEST_FILE);
    expect(loaded).toEqual(data);
  });

  it("save() is atomic (overwrites existing)", async () => {
    await storage.save(
      [{ id: 1, title: "old", body: "b", created_at: "x" }],
      TEST_FILE,
    );
    const newData = [{ id: 2, title: "new", body: "b", created_at: "y" }];
    await storage.save(newData, TEST_FILE);
    const loaded = await storage.load(TEST_FILE);
    expect(loaded).toEqual(newData);
  });
});
