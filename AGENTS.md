# Frontier Notes Public-Ready Repository Rules

This repository should stay safe to make public at any time. Treat all tracked
files as public-facing source.

## Public Boundary

- Keep site source, public content, contributor documentation, and non-secret
  configuration in this repo.
- Keep credentials, local machine state, generated output, deployment metadata,
  and private working notes out of git.
- Do not add personal local paths, machine-specific paths, private handoff notes,
  or agent/session state to tracked files.

## Files That Must Stay Untracked

- `.env*` except `.env.example`
- `.omc/`
- `.omx/`
- `.vercel/`
- `.astro/`
- `dist/`
- `node_modules/`
- `.admin-server.pid`
- `.admin-server.log`
- `CLAUDE.md` and other agent instruction or handoff files
- private drafts or notes that are not intended for publication

## API Keys and Server-Only Configuration

- All API keys (including keys for future features such as automatic
  translation) live in environment variables only and are read in server-side
  code only. See `SECURITY.md` for the full policy.
- Never use Astro's `PUBLIC_` prefix for a secret: `PUBLIC_` variables are
  embedded in the client bundle.

## Public Contribution Model

External contributors can propose changes through pull requests. Prefer public
PRs for:

- `README.md`
- `CONTRIBUTING.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `src/content/people/*.yaml`
- public-safe content under `src/content/**`

Be cautious with PRs that modify dependencies, build scripts, deployment
settings, layouts, or CMS configuration. Verify them locally before merging.

People Archive entries should use:

- one file per person under `src/content/people/<slug>.yaml`
- lowercase, hyphenated slugs
- public-safe information only
- no private contact details unless the person explicitly intends publication

## Verification

Before claiming the repo is public-ready:

```bash
npm run check:public
npm run typecheck
npm run build
```

`npm run check:public` should return no tracked private files or obvious secret
patterns.
