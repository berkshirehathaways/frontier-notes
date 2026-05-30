#!/usr/bin/env node
/**
 * Google Sheets CSV → src/content/people/*.yaml
 *
 * 사용법:
 *   1. Google Sheets → 파일 → 다운로드 → CSV(.csv)
 *   2. node scripts/import-people.mjs people.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../src/content/people');

const csvFile = process.argv[2];
if (!csvFile) {
  console.error('사용법: node scripts/import-people.mjs <csv파일>');
  process.exit(1);
}

const raw = fs.readFileSync(csvFile, 'utf-8');
const rows = parseCSV(raw);

if (rows.length < 2) {
  console.error('데이터가 없습니다.');
  process.exit(1);
}

const headers = rows[0];
const dataRows = rows.slice(2); // 첫줄 헤더, 두번째줄 예시 → 스킵

let created = 0;
let skipped = 0;

for (const row of dataRows) {
  const get = (key) => (row[headers.indexOf(key)] ?? '').trim();

  const name = get('이름');
  if (!name || name.startsWith('(예:')) { skipped++; continue; }

  const rawSlug = get('slug');
  const slug = rawSlug && !rawSlug.startsWith('(예:')
    ? rawSlug
    : toSlug(name);

  const role    = get('역할');
  const company = get('소속/프로젝트');
  const stage   = normalizeStage(get('stage'));
  const tools   = splitList(get('tools'));
  const signals = splitList(get('signals'));
  const summary = get('summary');

  const yaml = buildYaml({ name, slug, role, company, stage, tools, signals, summary });
  const outPath = path.join(OUTPUT_DIR, `${slug}.yaml`);

  fs.writeFileSync(outPath, yaml, 'utf-8');
  console.log(`✓ ${slug}.yaml — ${name}`);
  created++;
}

console.log(`\n완료: ${created}명 생성, ${skipped}명 스킵`);

/* ── 헬퍼 ── */

function buildYaml({ name, slug, role, company, stage, tools, signals, summary }) {
  const listLines = (arr) => arr.length
    ? arr.map(v => `  - ${v}`).join('\n')
    : '  []';

  return `name: ${name}
slug: ${slug}
role: ${role || 'n/a'}
company: ${company || 'n/a'}
stage: ${stage}
tools:
${listLines(tools)}
signals:
${listLines(signals)}
relatedNotes: []
summary: ${summary || ''}
`;
}

function splitList(str) {
  if (!str || str.startsWith('(예:')) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function normalizeStage(raw) {
  const valid = ['pre-company', 'project', 'startup', 'operator', 'investor', 'community'];
  const lower = raw.toLowerCase().trim();
  return valid.find(v => lower.includes(v)) ?? 'project';
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9ㄱ-ㅎ가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || `person-${Date.now()}`;
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuote && text[i + 1] === '"') { field += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      row.push(field); field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuote) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}
