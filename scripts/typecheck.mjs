import { readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT_DIR, SOURCE_DIR } from "./registry-utils.mjs";

const SOURCE_FILES = ["cta-banner.tsx", "hero-split.tsx"];

async function typecheck() {
  const indexPath = path.join(SOURCE_DIR, "index.ts");
  const indexContents = await readFile(indexPath, "utf8");

  for (const file of SOURCE_FILES) {
    const componentPath = path.join(SOURCE_DIR, file);
    const componentContents = await readFile(componentPath, "utf8");

    if (!componentContents.includes("export function")) {
      throw new Error(`Expected exported function component in ${path.relative(ROOT_DIR, componentPath)}`);
    }

    const exportNeedle = `./${file.replace(/\.tsx$/, "")}`;
    if (!indexContents.includes(exportNeedle)) {
      throw new Error(`Missing index export for ${file}`);
    }
  }

  console.log(`Typecheck baseline passed for ${SOURCE_FILES.length} components.`);
}

typecheck().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
