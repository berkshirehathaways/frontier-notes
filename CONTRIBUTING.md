# Contributing to Frontier Note

Frontier Note accepts public-safe contributions through pull requests.

## Good PRs

- Add or correct public person entries in `src/content/people/*.yaml`
- Add public-safe notes under `src/content/**`
- Fix typos, metadata, links, or accessibility issues
- Improve documentation for readers and contributors

## Do Not Commit

- API keys, tokens, passwords, OAuth secrets, or private keys
- `.env*` files, except `.env.example`
- local build output such as `dist/` or `.astro/`
- local service state such as `.admin-server.pid` or `.admin-server.log`
- private contact details unless explicitly intended for publication
- machine-specific absolute paths

## Content Guidelines

- Use lowercase, hyphenated slugs.
- Keep public person data limited to information already intended for publication.
- Mark unfinished notes with `draft: true`.
- Published issues should use `status: published`; unfinished issues should stay `draft`.
- Design or layout changes should follow `DESIGN.md` and `docs/design/content-hierarchy.md`.
- Public UI should show issue membership from `includedNotes`, not raw internal issue slugs.

## Before Opening a PR

```bash
npm install
npm run check:public
npm run typecheck
npm run build
```

The public safety check must pass before a PR is ready for review.
