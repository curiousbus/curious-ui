import path from "node:path";
import { existsSync } from "node:fs";
import {
  REGISTRY_ROOT_FILE,
  ROOT_DIR,
  loadRegistryItems,
  validateRegistryItemShape,
  assertSourceFilesExist
} from "./registry-utils.mjs";

async function lint() {
  const requiredFiles = [
    path.join(ROOT_DIR, "pnpm-workspace.yaml"),
    path.join(ROOT_DIR, "package.json"),
    REGISTRY_ROOT_FILE
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      throw new Error(`Missing required project file: ${path.relative(ROOT_DIR, file)}`);
    }
  }

  const registryItems = await loadRegistryItems();
  for (const { filename, item } of registryItems) {
    validateRegistryItemShape(item, filename);
    assertSourceFilesExist(item, filename);
  }

  console.log(`Lint checks passed for ${registryItems.length} registry items.`);
}

lint().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
