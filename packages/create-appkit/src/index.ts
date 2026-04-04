#!/usr/bin/env node

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { scaffoldProject } from './scaffold';

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.log('Usage: create-appkit <project-name>');
  console.log('');
  console.log('Example:');
  console.log('  npm create appkit@latest my-app');
  process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'));

if (existsSync(targetDir)) {
  console.error(`Error: Directory already exists: ${targetDir}`);
  process.exit(1);
}

scaffoldProject({ projectName, targetDir });

console.log(`\nCreated "${projectName}" — a React Native app powered by Expo.\n`);
console.log('Next steps:\n');
console.log(`  cd ${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`);
console.log('  npm install');
console.log('  npx expo start');
console.log('');
