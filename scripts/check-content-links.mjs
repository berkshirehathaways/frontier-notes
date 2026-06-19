#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'src/content');
const contentModelFile = path.join(root, 'src/lib/content-model.ts');
const standaloneIssueAliases = new Set(['standalone']);
const issueAliases = new Map([['bot-night', 'coaching-the-bot-night']]);
const failures = [];

function listFiles(dir, extensions) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath, extensions);
    return extensions.some((extension) => entry.name.endsWith(extension)) ? [fullPath] : [];
  });
}

function readText(file) {
  return readFileSync(file, 'utf8');
}

function stringTupleExport(file, exportName) {
  const match = readText(file).match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function frontmatter(text) {
  if (!text.startsWith('---\n')) return '';
  const end = text.indexOf('\n---', 4);
  return end === -1 ? '' : text.slice(4, end);
}

function scalarValue(block, key) {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : undefined;
}

function sectionLines(block, key) {
  const lines = block.split('\n');
  const start = lines.findIndex((line) => new RegExp(`^${key}:\\s*(?:$|\\[\\]\\s*$)`).test(line));
  if (start === -1 || lines[start].includes('[]')) return [];

  const section = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() === '') {
      section.push(line);
      continue;
    }
    if (!/^\s/.test(line)) break;
    section.push(line);
  }

  return section;
}

function includedNotes(block) {
  const lines = sectionLines(block, 'includedNotes');
  const notes = [];
  let current;

  for (const line of lines) {
    const collection = line.match(/^\s*-\s+collection:\s*(.+)$/);
    if (collection) {
      current = { collection: collection[1].trim().replace(/^['"]|['"]$/g, '') };
      notes.push(current);
      continue;
    }

    const slug = line.match(/^\s+slug:\s*(.+)$/);
    if (slug && current) current.slug = slug[1].trim().replace(/^['"]|['"]$/g, '');
  }

  return notes.filter((note) => note.collection && note.slug);
}

function noteExists(collection, slug) {
  return ['.mdx', '.md'].some((extension) => existsSync(path.join(contentDir, collection, `${slug}${extension}`)));
}

const noteCollections = stringTupleExport(contentModelFile, 'NOTE_COLLECTIONS');
const issueRefs = new Set();

if (noteCollections.length === 0) {
  failures.push('src/lib/content-model.ts must export NOTE_COLLECTIONS as a non-empty string tuple');
}

for (const file of listFiles(path.join(contentDir, 'issues'), ['.yaml', '.yml', '.json'])) {
  const block = readText(file);
  const basename = path.basename(file, path.extname(file));
  const slug = scalarValue(block, 'slug');
  const number = scalarValue(block, 'number');
  if (slug) issueRefs.add(slug);
  issueRefs.add(basename);
  if (number) issueRefs.add(`issue-${number}`);

  for (const note of includedNotes(block)) {
    if (!noteCollections.includes(note.collection)) {
      failures.push(`${path.relative(root, file)} includes unknown collection ${note.collection}`);
      continue;
    }

    if (!noteExists(note.collection, note.slug)) {
      failures.push(`${path.relative(root, file)} includes missing note ${note.collection}/${note.slug}`);
    }
  }
}

for (const collection of noteCollections) {
  for (const file of listFiles(path.join(contentDir, collection), ['.mdx', '.md'])) {
    const issue = scalarValue(frontmatter(readText(file)), 'issue');
    const canonicalIssue = issueAliases.get(issue) ?? issue;
    if (issue && !standaloneIssueAliases.has(issue) && !issueRefs.has(canonicalIssue)) {
      failures.push(`${path.relative(root, file)} references missing issue ${issue}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Content link check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Content link check passed.');
