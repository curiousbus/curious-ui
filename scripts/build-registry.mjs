import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  REGISTRY_APP_DIR,
  REGISTRY_ROOT_FILE,
  ROOT_DIR,
  loadRegistryItems,
  validateRegistryItemShape,
  assertSourceFilesExist,
  writeJson
} from "./registry-utils.mjs";

const execFileAsync = promisify(execFile);

function toBuildRegistryItem(item) {
  return {
    ...item,
    files: item.files.map((file) => ({
      ...file,
      path: path.posix.join("packages/blocks", file.path)
    }))
  };
}

async function buildRegistry() {
  const registryItems = await loadRegistryItems();
  if (registryItems.length < 6) {
    throw new Error("Expected at least 6 registry items for phase-1 baseline.");
  }

  const items = [];
  for (const { filename, item } of registryItems) {
    validateRegistryItemShape(item, filename);
    assertSourceFilesExist(item, filename);
    items.push(toBuildRegistryItem(item));
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "frontend-template-blocks",
    homepage: "https://github.com/curiousbus/frontend-template-blocks",
    items
  };

  // Keep a committed root registry manifest as shadcn build input.
  await writeJson(REGISTRY_ROOT_FILE, registry);

  await execFileAsync(
    "pnpm",
    ["exec", "shadcn", "build", "registry.json", "--output", "apps/registry/public/r"],
    { cwd: ROOT_DIR }
  );

  // Copy root registry entrypoint to static host output.
  await writeJson(path.join(REGISTRY_APP_DIR, "public", "registry.json"), registry);

  console.log(`Built ${registryItems.length} registry items via shadcn build.`);
}

buildRegistry().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
