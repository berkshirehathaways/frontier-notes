#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const blockedPathPatterns = [
  /^\.env(?!\.example$)/,
  /^\.omc\//,
  /^\.omx\//,
  /^\.codex\//,
  /^\.agents\//,
  /^\.vercel\//,
  /^\.astro\//,
  /^dist\//,
  /^node_modules\//,
  /^\.admin-server\.(pid|log)$/,
  /^docs\/(private|internal)\//,
  /^src\/content\/.*\/(private|internal)-.*\.mdx$/,
  /(^|\/)\.DS_Store$/,
  /^\.idea\//,
  /^CLAUDE\.md$/i,
  /handoff/i,
  /\.(log|pid)$/,
];

const blockedContentPatterns = [
  { name: 'local absolute user path', pattern: /\/(Users|home)\/[^/\s]+/ },
  { name: 'temporary private export path', pattern: /\/private\/tmp\/frontier-notes/ },
  { name: 'GitHub classic token', pattern: /ghp_[A-Za-z0-9_]{20,}/ },
  { name: 'GitHub fine-grained token', pattern: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'GitHub app/oauth token', pattern: /gh[osur]_[A-Za-z0-9_]{20,}/ },
  { name: 'OpenAI-style secret key', pattern: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: 'AWS access key id', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'Google API key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'Slack token', pattern: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: 'npm token', pattern: /npm_[A-Za-z0-9]{36}/ },
  { name: 'private key block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY( BLOCK)?-----/ },
  { name: 'secret-looking env assignment', pattern: /^[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|API_KEY)[A-Z0-9_]*=\S{8,}/m },
];

const failures = [];

for (const file of trackedFiles) {
  if (blockedPathPatterns.some((pattern) => pattern.test(file))) {
    failures.push(`${file}: blocked public path`);
    continue;
  }

  if (file.endsWith('.ico') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp')) {
    continue;
  }

  let content = '';
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const check of blockedContentPatterns) {
    if (check.pattern.test(content)) {
      failures.push(`${file}: ${check.name}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Public safety check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Public safety check passed.');
