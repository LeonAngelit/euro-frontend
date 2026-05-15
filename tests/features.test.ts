import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import { addFeature, loadFeatures, FeatureError } from "../src/features.js";

const TEST_FILE = "feature_list.json";

describe("Features Logic", () => {
  let originalContent: string;

  beforeEach(async () => {
    try {
      originalContent = await fs.readFile(TEST_FILE, "utf-8");
    } catch {
      originalContent = JSON.stringify({ project: "test", features: [] });
    }
  });

  afterEach(async () => {
    await fs.writeFile(TEST_FILE, originalContent, "utf-8");
  });

  it("assigns incremental ID and default values", async () => {
    const f = await addFeature({
      name: "test_feat",
      title: "Test Feat",
      description: "Desc",
      acceptance: ["A1"]
    });

    expect(f.id).toBeGreaterThan(0);
    expect(f.status).toBe("pending");
    expect(f.sdd).toBe(true);
    expect(f.name).toBe("test_feat");
  });

  it("fails if feature name already exists", async () => {
    const name = "duplicate_feat";
    await addFeature({ name, title: "T", description: "D", acceptance: ["A"] });
    
    await expect(addFeature({ name, title: "T2", description: "D2", acceptance: ["A2"] }))
      .rejects.toThrow(/already exists/);
  });

  it("allows overriding sdd to false", async () => {
    const f = await addFeature({
      name: "no_sdd",
      title: "No SDD",
      description: "D",
      acceptance: ["A"],
      sdd: false
    });
    expect(f.sdd).toBe(false);
  });
});
