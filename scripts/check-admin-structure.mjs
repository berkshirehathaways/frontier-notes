#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function readText(file) {
  return readFileSync(file, 'utf8');
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected "${expected}", got "${actual ?? ''}"`);
  }
}

function expectIncludes(file, text, label) {
  const content = readText(file);
  if (!content.includes(text)) failures.push(`${label}: ${file} must include ${text}`);
}

function expectNotIncludes(file, text, label) {
  const content = readText(file);
  if (content.includes(text)) failures.push(`${label}: ${file} must not include ${text}`);
}

const packageJson = readJson('package.json');
const scripts = packageJson.scripts ?? {};

expectEqual(scripts.build, 'npm run build:public', 'public build alias');
expectEqual(scripts['build:public'], 'ENABLE_KEYSTATIC=false astro build', 'public build command');
expectEqual(scripts['build:admin'], 'ENABLE_KEYSTATIC=true astro build', 'admin build command');
expectEqual(scripts['build:full'], 'npm run build:admin', 'legacy admin build alias');

if (!existsSync('src/lib/content-model.ts')) {
  failures.push('src/lib/content-model.ts must exist');
}

expectIncludes('astro.config.mjs', 'ENABLE_KEYSTATIC', 'explicit admin build mode');
expectNotIncludes('astro.config.mjs', 'SKIP_KEYSTATIC', 'negative admin build flag');
expectIncludes('astro.config.mjs', "site: 'https://frontiernote.com'", 'canonical Astro site');
expectIncludes('src/lib/site.ts', "baseUrl: 'https://frontiernote.com'", 'canonical SITE baseUrl');
expectIncludes('keystatic.config.ts', './src/lib/content-model', 'Keystatic shared content model');
expectIncludes('src/content.config.ts', './lib/content-model', 'Astro shared content model');
expectIncludes('src/lib/content.ts', './content-model', 'runtime shared content model');

if (failures.length > 0) {
  console.error('Admin structure check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Admin structure check passed.');
