# Security Policy

Noise is maintained as a public-ready repository. Do not include credentials,
private contact details, unpublished private drafts, or local machine state in
issues or pull requests.

## Reporting a Security Issue

If you find a security issue, avoid posting secrets or exploit details in a
public issue. Use GitHub private vulnerability reporting if it is enabled for
this repository, or contact the maintainer at `frontier.notes.magazine@gmail.com`.

## Secret Handling

- Keep secrets in `.env.local` or the deployment platform environment settings.
- Commit only `.env.example`, with variable names and no real values.
- Run `npm run check:public` before opening or merging a pull request.

## API Keys for Site Features

Any feature that needs an API key (for example a future automatic translation
feature) must follow these rules:

- Keys live only in environment variables (`.env.local` locally, platform
  environment settings in production). Never in tracked files.
- Keys are read only in server-side code (build steps, server routes, or
  scripts). Never ship a key to the client bundle.
- In Astro, variables prefixed with `PUBLIC_` are embedded in client code.
  Never use the `PUBLIC_` prefix for a secret.
- Add the variable name (with an empty value) to `.env.example` so
  contributors know it exists.
