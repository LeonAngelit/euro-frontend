import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import * as storage from "../src/storage.js";

const TEST_FILE = ".test_cli_notes.json";

describe("CLI", () => {
  const run = (args: string[]) => {
    return spawnSync("npx", ["tsx", "src/cli.ts", ...args], {
      env: { ...process.env, NOTES_FILE: TEST_FILE },
      encoding: "utf-8",
    });
  };

  beforeEach(async () => {
    try {
      await fs.unlink(TEST_FILE);
    } catch {}
  });

  afterEach(async () => {
    try {
      await fs.unlink(TEST_FILE);
    } catch {}
  });

  it("add command creates a note", () => {
    const res = run(["add", "t1", "--body", "b1"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("id=1");
  });

  it("list command shows existing notes", () => {
    run(["add", "one", "--body", "a"]);
    run(["add", "two", "--body", "b"]);
    const res = run(["list"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("one");
    expect(res.stdout).toContain("two");
    expect(res.stdout.trim().split("\n")).toHaveLength(2);
  });

  it("show command prints details", () => {
    run(["add", "title-one", "--body", "body-one"]);
    const res = run(["show", "1"]);
    expect(res.status).toBe(0);
    const lines = res.stdout.trim().split("\n");
    expect(lines[0]).toBe("title-one");
    expect(lines[1]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(lines[2]).toBe("body-one");
  });

  it("delete command removes note", () => {
    run(["add", "one"]);
    const res = run(["delete", "1"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("deleted id=1");
    const resList = run(["list"]);
    expect(resList.stdout.trim()).toBe("");
  });

  it("search command finds matches", () => {
    run(["add", "buy milk"]);
    run(["add", "call doctor"]);
    const res = run(["search", "milk"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("buy milk");
    expect(res.stdout).not.toContain("call doctor");
  });

  it("edit command updates fields", () => {
    run(["add", "old", "--body", "body"]);
    const res = run(["edit", "1", "--title", "new"]);
    expect(res.status).toBe(0);
    const resShow = run(["show", "1"]);
    expect(resShow.stdout).toContain("new");
    expect(resShow.stdout).toContain("body");
  });

  it("recent command orders by date", async () => {
    const data = [
      { id: 1, title: "old", body: "b", created_at: "2026-01-01T10:00:00Z" },
      { id: 2, title: "new", body: "b", created_at: "2026-05-15T10:00:00Z" },
    ];
    await storage.save(data, TEST_FILE);

    const res = run(["recent", "--limit", "1"]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("new");
    expect(res.stdout).not.toContain("old");
  });

  it("fails if id does not exist", () => {
    const res = run(["show", "99"]);
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain("99");
  });
});
