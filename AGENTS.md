# Frontier Notes Private Workspace Rules

This repository is the private working source for Frontier Notes. Treat it as the development workspace, not the public contribution surface.

## Repository Roles

- Private source: `/Users/stevenshin/Documents/New project/frontier-notes`
- Public clean repo: `/private/tmp/frontier-notes-public-clean`
- Public GitHub repo: `berkshirehathaways/frontier-notes-public`
- Private GitHub repo: `berkshirehathaways/frontier-notes`

Default branch policy:
- Work in this private repo first.
- Do not make the private GitHub repo public.
- Publish only through a clean-tree export to the public repo.

## Public Export Rules

When asked to publish, sync, or prepare public work:

1. Build from the current private working tree.
2. Copy only public-safe files into `/private/tmp/frontier-notes-public-clean`.
3. Exclude private/runtime/generated files:
   - `.git/`
   - `.omc/`
   - `.omx/`
   - `.vercel/`
   - `.astro/`
   - `dist/`
   - `node_modules/`
   - `docs/CLAUDE_HANDOFF.md`
   - `docs/design-audit.md`
   - `docs/design-variants.md`
   - `src/content/essays/internal-draft-note.mdx`
   - `.env*`
4. Verify the clean repo before pushing:
   - `npm run typecheck`
   - `npm run build`
   - scan for obvious secrets or local agent metadata
5. Commit and push from the public clean repo, not from this private repo.

Preferred export command:

```bash
rsync -a --delete \
  --exclude .git \
  --exclude node_modules \
  --exclude dist \
  --exclude .astro \
  --exclude .vercel \
  --exclude .omc \
  --exclude .omx \
  --exclude docs/CLAUDE_HANDOFF.md \
  --exclude docs/design-audit.md \
  --exclude docs/design-variants.md \
  --exclude src/content/essays/internal-draft-note.mdx \
  ./ /private/tmp/frontier-notes-public-clean/
```

## Files That Must Stay Private

Do not commit or publish local agent/session files, private handoff notes, draft test content, credentials, deployment metadata, or generated build output.

The following may remain on disk locally but must not be tracked in the public repo:
- `.omc/`
- `.omx/`
- `.vercel/`
- private docs under `docs/`
- test-only draft content

## Public Contribution Model

The public repo is the contribution surface for People Archive PRs.

Accept simple public PRs primarily in:
- `.github/PULL_REQUEST_TEMPLATE.md`
- `README.md`
- `src/content/people/*.yaml`
- public-safe content under `src/content/**`

Be cautious with PRs that modify build config, dependencies, scripts, layouts, or deployment settings. Verify them locally before accepting.

People Archive entries should use:
- one file per person under `src/content/people/<slug>.yaml`
- public-safe information only
- lowercase, hyphenated slugs
- no private contact details unless explicitly intended for publication

## Verification

Before claiming the private or public tree is ready:

```bash
npm run typecheck
npm run build
```

For public pushes, also confirm:

```bash
git ls-files | rg '^\.omc/|^\.omx/|^\.vercel/|^docs/(CLAUDE_HANDOFF|design-audit|design-variants)\.md$|^src/content/essays/internal-draft-note\.mdx$'
```

This command should return no tracked files in the public repo.
