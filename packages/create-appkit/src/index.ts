#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.log("Usage: create-appkit <project-name>");
  console.log("");
  console.log("Example:");
  console.log("  npm create appkit@latest my-app");
  process.exit(1);
}

const projectDir = resolve(process.cwd(), projectName);

if (existsSync(projectDir)) {
  console.error(`Error: Directory "${projectName}" already exists.`);
  process.exit(1);
}

mkdirSync(projectDir, { recursive: true });

const packageJson = {
  name: basename(projectName),
  version: "1.0.0",
  scripts: {
    dev: "appkit dev",
    build: "appkit build",
  },
  dependencies: {
    "@appkit/builder": "^0.1.0",
  },
};

writeFileSync(
  resolve(projectDir, "package.json"),
  JSON.stringify(packageJson, null, 2) + "\n"
);

const appkitConfig = {
  store: "my-store.myshopify.com",
  type: "web",
};

writeFileSync(
  resolve(projectDir, "appkit.config.json"),
  JSON.stringify(appkitConfig, null, 2) + "\n"
);

console.log(`\nCreated "${projectName}" with appkit scaffolding.\n`);
console.log("Next steps:\n");
console.log(`  cd ${projectName}`);
console.log("  npm install");
console.log("  npm run dev");
console.log("");
