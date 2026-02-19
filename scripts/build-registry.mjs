import path from "node:path";
import {
  REGISTRY_APP_DIR,
  REGISTRY_OUTPUT_DIR,
  ensureOutputDir,
  loadRegistryItems,
  validateRegistryItemShape,
  assertSourceFilesExist,
  writeJson
} from "./registry-utils.mjs";

async function buildRegistry() {
  const registryItems = await loadRegistryItems();
  if (registryItems.length < 6) {
    throw new Error("Expected at least 6 registry items for phase-1 baseline.");
  }

  await ensureOutputDir();

  const itemRefs = [];
  const index = [];

  for (const { filename, item } of registryItems) {
    validateRegistryItemShape(item, filename);
    assertSourceFilesExist(item, filename);

    const outputName = `${item.name}.json`;
    await writeJson(path.join(REGISTRY_OUTPUT_DIR, outputName), item);

    itemRefs.push(`./r/${outputName}`);
    index.push({
      name: item.name,
      title: item.title,
      description: item.description,
      type: item.type,
      href: `./${outputName}`
    });
  }

  await writeJson(path.join(REGISTRY_OUTPUT_DIR, "index.json"), {
    name: "frontend-template-blocks",
    generatedAt: new Date().toISOString(),
    items: index
  });

  await writeJson(path.join(REGISTRY_APP_DIR, "registry.json"), {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "frontend-template-blocks",
    homepage: "https://github.com/curiousbus/frontend-template-blocks",
    items: itemRefs
  });

  console.log(`Built ${registryItems.length} registry items to apps/registry/public/r`);
}

buildRegistry().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
