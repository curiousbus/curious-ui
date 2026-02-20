import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..");
export const BLOCKS_DIR = path.join(ROOT_DIR, "packages", "blocks");
export const ITEMS_DIR = path.join(BLOCKS_DIR, "registry");
export const SOURCE_DIR = path.join(BLOCKS_DIR, "src");
export const REGISTRY_ROOT_FILE = path.join(ROOT_DIR, "registry.json");
export const REGISTRY_APP_DIR = path.join(ROOT_DIR, "apps", "registry");
export const REGISTRY_OUTPUT_DIR = path.join(REGISTRY_APP_DIR, "public", "r");

export async function loadRegistryItems() {
  const files = await readdir(ITEMS_DIR);
  const jsonFiles = files.filter((file) => file.endsWith(".json")).sort();

  const items = [];
  for (const filename of jsonFiles) {
    const fullPath = path.join(ITEMS_DIR, filename);
    const raw = await readFile(fullPath, "utf8");
    const item = JSON.parse(raw);
    items.push({ filename, fullPath, item });
  }

  return items;
}

export function validateRegistryItemShape(item, filename) {
  const requiredTopLevel = ["$schema", "name", "type", "title", "description", "files"];
  for (const key of requiredTopLevel) {
    if (!(key in item)) {
      throw new Error(`${filename}: missing required field '${key}'`);
    }
  }

  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`${filename}: 'files' must be a non-empty array`);
  }

  for (const file of item.files) {
    if (!file.path || !file.type) {
      throw new Error(`${filename}: every file entry must include path/type`);
    }
  }
}

export function assertSourceFilesExist(item, filename) {
  for (const file of item.files) {
    const sourcePath = path.join(BLOCKS_DIR, file.path);
    if (!existsSync(sourcePath)) {
      throw new Error(`${filename}: referenced source file not found: ${file.path}`);
    }
  }
}

export async function ensureOutputDir() {
  await mkdir(REGISTRY_OUTPUT_DIR, { recursive: true });
}

export async function writeJson(filepath, value) {
  await writeFile(filepath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
