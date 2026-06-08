# Interview Writer Studio (Internal)

Internal-only tool for generating `frontier-notes` interview markdown drafts from:
- direct transcript paste, or
- browser recording -> Friendli transcription -> K-EXAONE generation.

## Security constraints
- No audio file persistence.
- No DB storage for transcript/audio.
- No automatic publishing.
- No logging of transcript full text, token, or API key.
- `FRIENDLI_API_KEY` is read in server-only module.

## Required environment variables
Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

```dotenv
FRIENDLI_API_KEY=
FRIENDLI_BASE_URL=https://api.friendli.ai/serverless/v1
TRANSCRIBE_MODEL=openai/whisper-large-v3
EXAONE_MODEL=LGAI-EXAONE/K-EXAONE-236B-A23B
STUDIO_ACCESS_TOKEN=
```

## Local usage
1. Set `.env.local`.
2. Start local server.
3. Open `/studio/interview-writer`.
4. Enter access token.
5. Record audio or paste transcript.
6. Run transcribe or generate.
7. Copy markdown output.

```bash
npm install
npm run dev
```

Open: [http://localhost:3000/studio/interview-writer](http://localhost:3000/studio/interview-writer)

## Scripts
```bash
npm run test
npm run lint
npm run typecheck
npm run build
```
