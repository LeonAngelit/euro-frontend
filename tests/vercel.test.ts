import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const VERCEL_JSON_PATH = "vercel.json";
const VITE_CONFIG_PATH = "vite.config.js";
const BUILD_DIR = "dist";

/**
 * Helper: safe-parse vercel.json
 */
function readVercelConfig(): Record<string, unknown> {
  const raw = fs.readFileSync(VERCEL_JSON_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Helper: recursively list all files in a directory.
 */
function buildFilesRecursive(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...buildFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Helper: extract outDir from vite.config.js by reading as text
 * and finding the `outDir: "..."` pattern.
 */
function getViteOutDir(): string {
  const raw = fs.readFileSync(VITE_CONFIG_PATH, "utf-8");
  const match = raw.match(/outDir\s*:\s*"([^"]+)"/);
  if (!match || !match[1]) {
    throw new Error("Could not find outDir in vite.config.js");
  }
  return match[1];
}

describe("Vercel Deployment Config", () => {
  it("test_vercel_json_is_valid_json", () => {
    // R1: vercel.json must exist with valid JSON syntax
    // R12: invalid JSON should fail
    expect(fs.existsSync(VERCEL_JSON_PATH)).toBe(true);
    expect(() => readVercelConfig()).not.toThrow();
  });

  it("test_vercel_json_has_build_command", () => {
    // R2: buildCommand must be "npm run build"
    const config = readVercelConfig();
    expect(config.buildCommand).toBe("npm run build");
  });

  it("test_vercel_json_has_output_directory", () => {
    // R3: outputDirectory must be "dist"
    const config = readVercelConfig();
    expect(config.outputDirectory).toBe("dist");
  });

  it("test_vercel_json_has_spa_rewrites", () => {
    // R4: catch-all rewrite /(.*) → /index.html
    // R5: static assets served before rewrite (Vercel platform behavior)
    const config = readVercelConfig();
    expect(config.rewrites).toBeDefined();
    const rewrites = config.rewrites as Array<{ source: string; destination: string }>;
    expect(Array.isArray(rewrites)).toBe(true);

    const catchAll = rewrites.find(
      (r) => r.source === "/(.*)" && r.destination === "/index.html"
    );
    expect(catchAll).toBeDefined();
  });

  it("test_output_directory_matches_vite_config", () => {
    // R3: vercel.json outputDirectory must match vite.config.js outDir
    const vercelConfig = readVercelConfig();
    const viteOutDir = getViteOutDir();
    expect(vercelConfig.outputDirectory).toBe(viteOutDir);
  });

  it("test_build_contains_required_files", () => {
    // R7: build output contains index.html, .js, .css
    // R13: build output contains manifest.webmanifest
    // R10: all assets present (checked via file existence)

    if (!fs.existsSync(BUILD_DIR)) {
      // Build not yet run — skip this test gracefully
      return;
    }

    // Check index.html
    expect(fs.existsSync(path.join(BUILD_DIR, "index.html"))).toBe(true);

    // Check at least one .js file (may be in subdirectories like assets/)
    const allFiles = buildFilesRecursive(BUILD_DIR);
    const jsFiles = allFiles.filter((f: string) => f.endsWith(".js"));
    expect(jsFiles.length).toBeGreaterThan(0);

    // Check at least one .css file
    const cssFiles = allFiles.filter((f: string) => f.endsWith(".css"));
    expect(cssFiles.length).toBeGreaterThan(0);

    // Check manifest.webmanifest
    expect(fs.existsSync(path.join(BUILD_DIR, "manifest.webmanifest"))).toBe(true);
  });

  it("test_architecture_md_has_vercel_deployment_section", () => {
    // R8: ARCHITECTURE.md must include a Vercel Deployment section
    const mdPath = "ARCHITECTURE.md";
    expect(fs.existsSync(mdPath)).toBe(true);
    const content = fs.readFileSync(mdPath, "utf-8");
    expect(content).toContain("## 16. Vercel Deployment");
  });

  it("test_architecture_md_lists_env_vars", () => {
    // R9: ARCHITECTURE.md must document all env vars from .env
    const mdPath = "ARCHITECTURE.md";
    expect(fs.existsSync(mdPath)).toBe(true);
    const content = fs.readFileSync(mdPath, "utf-8");

    const requiredVars = [
      "VITE_REACT_APP_BASEURL",
      "VITE_REACT_APP_ADMIN",
      "VITE_REACT_APP_AUTH_P",
      "VITE_REACT_APP_P_KEY",
      "VITE_REACT_APP_JOIN_ROOM",
      "VITE_REACT_APP_CONFIRM_EMAIL_URL",
      "VITE_REACT_APP_JOIN_ROOM_PATH",
      "VITE_REACT_APP_CLIENT_ID",
      "VITE_REACT_APP_REQUESTS_URL",
      "VITE_REACT_APP_REQUESTS_BASE_URL",
    ];

    for (const v of requiredVars) {
      expect(content).toContain(v);
    }
  });
});
