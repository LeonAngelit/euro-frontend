import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs/promises";

const TEST_FILE = "feature_list.json";

function run(args: string[]) {
  try {
    const stdout = execSync(`npx tsx src/cli.ts ${args.join(" ")}`, {
      encoding: "utf-8",
      env: { ...process.env, NOTES_FILE: ".notes_test.json" },
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error: any) {
    return {
      status: error.status,
      stdout: error.stdout || "",
      stderr: error.stderr || "",
    };
  }
}

describe("CLI - Feature Add", () => {
  let originalContent: string;

  beforeEach(async () => {
    originalContent = await fs.readFile(TEST_FILE, "utf-8");
  });

  afterEach(async () => {
    await fs.writeFile(TEST_FILE, originalContent, "utf-8");
  });

  it("adds a feature via flags", () => {
    const name = "feat_via_flags";
    const res = run([
      "feature-add",
      name,
      "--title",
      "Title",
      "--description",
      "Desc",
      "--acceptance",
      "A1,A2",
    ]);

    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Created feature id=");
    
    const content = JSON.parse(execSync(`cat ${TEST_FILE}`, { encoding: "utf-8" }));
    const feat = content.features.find((f: any) => f.name === name);
    expect(feat).toBeDefined();
    expect(feat.title).toBe("Title");
    expect(feat.acceptance).toEqual(["A1", "A2"]);
    expect(feat.sdd).toBe(true); // Default
  });

  it("fails if name is missing", () => {
    const res = run(["feature-add"]);
    expect(res.status).not.toBe(0);
  });
});
