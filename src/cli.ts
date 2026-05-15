#!/usr/bin/env node
/** Command line interface. */
import { Command } from "commander";
import * as storage from "./storage.js";
import { Note, NoteError, NoteNotFound } from "./notes.js";
import { FeatureError } from "./features.js";

const program = new Command();

program.name("notes").description("Minimalist notes CLI.").version("1.0.0");

program
  .command("add")
  .description("Add a note.")
  .argument("<title>", "Note title")
  .option("--body <body>", "Note body", "")
  .action(async (title, options) => {
    try {
      const notes = await storage.load();
      const note = Note.new(title, options.body, notes);
      notes.push(note.toDict());
      await storage.save(notes);
      process.stdout.write(`id=${note.id}\n`);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("list")
  .description("List all notes.")
  .action(async () => {
    try {
      const notes = await storage.load();
      for (const n of notes) {
        process.stdout.write(`${n.id}\t${n.created_at}\t${n.title}\n`);
      }
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("show")
  .description("Show a note by id.")
  .argument("<id>", "Note ID", (val) => parseInt(val, 10))
  .action(async (id) => {
    try {
      const notes = await storage.load();
      const n = notes.find((note) => note.id === id);
      if (!n) throw new NoteNotFound(`note with id=${id} does not exist`);
      process.stdout.write(`${n.title}\n${n.created_at}\n${n.body}\n`);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("delete")
  .description("Delete a note by id.")
  .argument("<id>", "Note ID", (val) => parseInt(val, 10))
  .action(async (id) => {
    try {
      const notes = await storage.load();
      const remaining = notes.filter((n) => n.id !== id);
      if (remaining.length === notes.length) {
        throw new NoteNotFound(`note with id=${id} does not exist`);
      }
      await storage.save(remaining);
      process.stdout.write(`deleted id=${id}\n`);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("search")
  .description("Search notes by keyword.")
  .argument("<query>", "Keyword to search")
  .action(async (query) => {
    try {
      const notes = await storage.load();
      const q = query.toLowerCase();
      const matches = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
      );
      if (matches.length === 0) {
        throw new NoteNotFound(`no notes containing "${query}"`);
      }
      for (const n of matches) {
        process.stdout.write(`${n.id}\t${n.created_at}\t${n.title}\n`);
      }
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("recent")
  .description("List the N most recent notes.")
  .option("--limit <number>", "Note limit", (val) => parseInt(val, 10), 5)
  .action(async (options) => {
    try {
      if (options.limit <= 0) {
        throw new NoteError("--limit must be a positive integer");
      }
      const notes = await storage.load();
      if (notes.length === 0) return;
      const ordered = [...notes].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      );
      for (const n of ordered.slice(0, options.limit)) {
        process.stdout.write(`${n.id}\t${n.created_at}\t${n.title}\n`);
      }
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("edit")
  .description("Edit a note by id.")
  .argument("<id>", "Note ID", (val) => parseInt(val, 10))
  .option("--title <string>", "New title")
  .option("--body <string>", "New body")
  .action(async (id, options) => {
    try {
      if (options.title === undefined && options.body === undefined) {
        throw new NoteError("you must pass --title and/or --body");
      }
      const notes = await storage.load();
      const index = notes.findIndex((n) => n.id === id);
      if (index === -1)
        throw new NoteNotFound(`note with id=${id} does not exist`);

      const n = notes[index];
      notes[index] = {
        ...n,
        title: options.title !== undefined ? options.title : n?.title,
        body: options.body !== undefined ? options.body : n?.body,
        id: options.id !== undefined ? options.id : n?.id,
        created_at:
          options.created_at !== undefined ? options.created_at : n?.created_at,
      };

      await storage.save(notes);
      process.stdout.write(`edited id=${id}\n`);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("feature-add")
  .description("Add a new feature to feature_list.json.")
  .argument("<name>", "Internal name of the feature (snake_case)")
  .option("--title <string>", "Human-readable title")
  .option("--description <string>", "Short description")
  .option("--acceptance <string>", "Comma-separated list of acceptance criteria")
  .option("--sdd <boolean>", "Enable Spec Driven Development (default: true)", (val) => val === "true" || val === "1")
  .action(async (name, options) => {
    try {
      const { addFeature } = await import("./features.js");
      const { promptRequired, promptList } = await import("./prompts.js");

      const title = options.title || (await promptRequired("Title"));
      const description =
        options.description || (await promptRequired("Description"));
      const acceptance = options.acceptance
        ? options.acceptance.split(",").map((s: string) => s.trim())
        : await promptList("Acceptance criteria");

      const feature = await addFeature({
        name,
        title,
        description,
        acceptance,
        sdd: options.sdd,
      });

      process.stdout.write(`Created feature id=${feature.id}\n`);
    } catch (error) {
      handleError(error);
    }
  });

function handleError(error: unknown) {
  if (error instanceof NoteError || error instanceof FeatureError) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
  throw error;
}

program.parseAsync(process.argv);
