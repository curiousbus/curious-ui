import { spawn } from "node:child_process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command} ${args.join(" ")} (exit ${code ?? "unknown"})`));
    });
  });
}

async function releasePublish() {
  await run("pnpm", ["run", "build:registry"]);

  if (!process.env.NPM_TOKEN) {
    console.log(
      "NPM_TOKEN is not set. Skipping npm publish. Registry deployment still runs via GitHub Pages workflow.",
    );
    return;
  }

  await run("pnpm", ["changeset:publish"]);
}

releasePublish().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
