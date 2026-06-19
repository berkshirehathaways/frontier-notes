import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';

const repoRoot = path.resolve(import.meta.dirname, '..');
const checker = path.join(repoRoot, 'scripts/check-content-links.mjs');

async function withFixture(files, run) {
  const fixtureRoot = path.join(tmpdir(), `frontier-content-links-${process.pid}-${Date.now()}`);
  try {
    for (const [file, contents] of Object.entries(files)) {
      const fullPath = path.join(fixtureRoot, file);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, contents);
    }

    return run(fixtureRoot);
  } finally {
    await rm(fixtureRoot, { force: true, recursive: true });
  }
}

test('fails when an issue includes a missing note slug', async () => {
  await withFixture(
    {
      'src/lib/content-model.ts': "export const NOTE_COLLECTIONS = ['field-notes'] as const;\n",
      'src/content/issues/issue-01.yaml': `title: Issue
slug: issue-one
number: '01'
includedNotes:
  - collection: field-notes
    slug: missing-note
`,
    },
    (fixtureRoot) => {
      const result = spawnSync(process.execPath, [checker], {
        cwd: fixtureRoot,
        encoding: 'utf8',
      });

      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /includes missing note field-notes\/missing-note/);
    },
  );
});

test('ignores upcoming note slugs when validating included notes', async () => {
  await withFixture(
    {
      'src/lib/content-model.ts': "export const NOTE_COLLECTIONS = ['field-notes'] as const;\n",
      'src/content/field-notes/published-note.mdx': `---
title: Published note
subtitle: Existing note
slug: published-note
date: 2026-01-01
type: field-note
issue: issue-one
draft: false
---
Body
`,
      'src/content/issues/issue-01.yaml': `title: Issue
slug: issue-one
number: '01'
includedNotes:
  - collection: field-notes
    slug: published-note
upcomingNotes:
  - title: Future note
    type: SYSTEM
    slug: future-note
`,
    },
    (fixtureRoot) => {
      const result = spawnSync(process.execPath, [checker], {
        cwd: fixtureRoot,
        encoding: 'utf8',
      });

      assert.equal(result.status, 0, result.stderr);
    },
  );
});

test('resolves included note slugs from frontmatter, not only filenames', async () => {
  await withFixture(
    {
      'src/lib/content-model.ts': "export const NOTE_COLLECTIONS = ['field-notes'] as const;\n",
      'src/content/field-notes/long-editorial-file-name.mdx': `---
title: Short route note
subtitle: Existing note
slug: short-route
date: 2026-01-01
type: field-note
issue: issue-one
draft: false
---
Body
`,
      'src/content/issues/issue-01.yaml': `title: Issue
slug: issue-one
number: '01'
includedNotes:
  - collection: field-notes
    slug: short-route
`,
    },
    (fixtureRoot) => {
      const result = spawnSync(process.execPath, [checker], {
        cwd: fixtureRoot,
        encoding: 'utf8',
      });

      assert.equal(result.status, 0, result.stderr);
    },
  );
});

test('fails when two notes in one collection share a frontmatter slug', async () => {
  await withFixture(
    {
      'src/lib/content-model.ts': "export const NOTE_COLLECTIONS = ['field-notes'] as const;\n",
      'src/content/field-notes/first.mdx': `---
title: First
subtitle: Existing note
slug: duplicate-route
date: 2026-01-01
type: field-note
issue: issue-one
draft: false
---
Body
`,
      'src/content/field-notes/second.mdx': `---
title: Second
subtitle: Existing note
slug: duplicate-route
date: 2026-01-02
type: field-note
issue: issue-one
draft: false
---
Body
`,
      'src/content/issues/issue-01.yaml': `title: Issue
slug: issue-one
number: '01'
includedNotes: []
`,
    },
    (fixtureRoot) => {
      const result = spawnSync(process.execPath, [checker], {
        cwd: fixtureRoot,
        encoding: 'utf8',
      });

      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /duplicate note slug field-notes\/duplicate-route/);
    },
  );
});
