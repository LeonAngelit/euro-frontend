/** Atomic persistence of notes in a JSON file. */
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NoteData } from "./notes.js";

const DEFAULT_NOTES_PATH = process.env.NOTES_FILE || ".notes.json";

export async function load(filePath?: string): Promise<NoteData[]> {
  const targetPath = filePath || DEFAULT_NOTES_PATH;
  try {
    const content = await fs.readFile(targetPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function save(
  notes: NoteData[],
  filePath?: string,
): Promise<void> {
  const targetPath = filePath || DEFAULT_NOTES_PATH;
  const absPath = path.resolve(targetPath);
  const directory = path.dirname(absPath);
  const tmpPath = path.join(directory, `.notes_${randomUUID()}.json`);

  try {
    // Atomic write: write to temp file and rename
    await fs.writeFile(tmpPath, JSON.stringify(notes, null, 2), "utf-8");
    await fs.rename(tmpPath, targetPath);
  } catch (error) {
    try {
      await fs.unlink(tmpPath);
    } catch {
      // Ignore error when deleting temp file if it doesn't exist
    }
    throw error;
  }
}
