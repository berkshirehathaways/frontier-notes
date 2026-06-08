# Interview Writer MVP TDD Plan

## Goal
Build an internal-only `/studio/interview-writer` tool that records audio or accepts transcript input, calls Friendli transcription + K-EXAONE generation APIs, and returns a markdown draft in frontier-notes tone.

## Constraints
- No deploy, no main merge, no DB persistence.
- No raw audio storage.
- No transcript full-text logging.
- No API key/token logging.
- No public navigation exposure.
- Client must never reference `process.env.FRIENDLI_API_KEY`.

## Test Order (Red -> Green)
1. Auth unit tests (`lib/interview/auth.ts`)
  - Missing `STUDIO_ACCESS_TOKEN` returns safe config error.
  - Missing `x-studio-token` returns unauthorized.
  - Wrong `x-studio-token` returns unauthorized.
  - Correct token passes.
2. Validation unit tests (`lib/interview/validation.ts`)
  - Missing transcript fails for generate request.
  - Optional metadata defaults are safely applied.
  - Missing audio file fails for transcribe request.
3. Prompt unit tests (`lib/interview/prompt.ts`)
  - System prompt includes all tone and safety constraints.
  - User prompt includes frontmatter schema and body structure.
  - Category is fixed to `interview`.
4. Friendli client tests (`lib/interview/friendli.ts`)
  - API key read from server-only module.
  - Transcribe/generate calls use injectable/mockable `fetch`.
5. API route tests (`app/api/interview/*/route.ts`)
  - Token failures return 401 before Friendli call.
  - Input failures return 400.
  - Transcribe success returns transcript only.
  - Generate success returns markdown only.
6. UI tests (`app/studio/interview-writer/page.tsx` + client form)
  - Direct transcript paste can generate without transcription.
  - Start/stop recording buttons exist.
  - Transcribe button exists.
  - Copy markdown button exists.
  - Loading and error states are visible.

## Implementation After Red Tests
- Add server-only interview modules:
  - `src/lib/interview/auth.ts`
  - `src/lib/interview/validation.ts`
  - `src/lib/interview/prompt.ts`
  - `src/lib/interview/friendli.ts`
- Add API routes:
  - `src/app/api/interview/transcribe/route.ts`
  - `src/app/api/interview/generate/route.ts`
- Add internal UI route:
  - `src/app/studio/interview-writer/page.tsx`
  - `src/components/interview-writer-form.tsx`
- Add docs/env:
  - `.env.example`
  - `README.md` usage section
