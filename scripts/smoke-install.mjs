import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  assertSourceFilesExist,
  BLOCKS_DIR,
  ensureOutputDir,
  loadRegistryItems,
  REGISTRY_OUTPUT_DIR,
  ROOT_DIR,
  validateRegistryItemShape,
} from "./registry-utils.mjs";

async function smokeInstall() {
  await ensureOutputDir();

  const registryItems = await loadRegistryItems();
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "ftb-smoke-"));

  try {
    for (const { filename, item } of registryItems) {
      validateRegistryItemShape(item, filename);
      assertSourceFilesExist(item, filename);

      for (const file of item.files) {
        const sourcePath = path.join(BLOCKS_DIR, file.path);
        const targetPath = path.join(tempRoot, file.target);
        await mkdir(path.dirname(targetPath), { recursive: true });
        const source = await readFile(sourcePath, "utf8");
        await writeFile(targetPath, source, "utf8");
      }

      const builtItemPath = path.join(REGISTRY_OUTPUT_DIR, `${item.name}.json`);
      const builtItem = await readFile(builtItemPath, "utf8");
      if (!builtItem.includes(`"name": "${item.name}"`)) {
        throw new Error(`Built registry artifact missing or invalid for ${item.name}`);
      }
    }

    console.log(
      `Smoke install passed for ${registryItems.length} items in ${path.relative(ROOT_DIR, tempRoot)}.`,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

smokeInstall().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
