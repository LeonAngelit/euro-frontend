/** Feature management logic. */
import { load, save } from "./storage.js";

export interface Feature {
  id: number;
  name: string;
  title: string;
  description: string;
  acceptance: string[];
  sdd?: boolean;
  status: "pending" | "spec_ready" | "in_progress" | "done" | "blocked";
}

export class FeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FeatureError";
  }
}

export class DuplicateFeatureError extends FeatureError {
  constructor(name: string) {
    super(`Feature with name "${name}" already exists`);
    this.name = "DuplicateFeatureError";
  }
}

const FEATURE_LIST_PATH = "feature_list.json";

export async function loadFeatures(): Promise<Feature[]> {
  try {
    const data = await load(FEATURE_LIST_PATH) as any;
    return data.features || [];
  } catch (error) {
    return [];
  }
}

export async function saveFeatures(features: Feature[]): Promise<void> {
  const data = await load(FEATURE_LIST_PATH) as any;
  data.features = features;
  await save(data, FEATURE_LIST_PATH);
}

export async function addFeature(featureData: {
  name: string;
  title: string;
  description: string;
  acceptance: string[];
  sdd?: boolean;
}): Promise<Feature> {
  const features = await loadFeatures();
  
  if (features.some(f => f.name === featureData.name)) {
    throw new DuplicateFeatureError(featureData.name);
  }

  const maxId = features.reduce((max, f) => (f.id > max ? f.id : max), 0);
  
  const newFeature: Feature = {
    id: maxId + 1,
    name: featureData.name,
    title: featureData.title,
    description: featureData.description,
    acceptance: featureData.acceptance,
    sdd: featureData.sdd ?? true,
    status: "pending"
  };

  features.push(newFeature);
  await saveFeatures(features);
  
  return newFeature;
}
