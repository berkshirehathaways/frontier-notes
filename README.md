# Frontier Note (프론티어노트) — thefutureisnowhere

AI 최전선에서 아직 이름 붙지 않은 작업 방식과 장면을 기록하는 에디토리얼 매거진입니다.

- 사이트 이름: 프론티어노트
- 영문 보조명: thefutureisnowhere
- 부제: AI 최전선의 아직 이름 붙지 않은 장면을 기록하는 매거진
- 핵심 읽기: `the future is nowhere` ↔ `the future is now here`
- 프로덕션: https://frontiernote.com

## 기술 스택

- Astro 6 + TypeScript + MDX
- Astro Content Collections (`src/content.config.ts`)
- Keystatic (Git 기반 CMS, `keystatic.config.ts`)
- Vercel 배포 (기본은 완전 정적 빌드, 어드민 활성화 시에만 서버 라우트 추가)

## 콘텐츠 모델

Issue가 편집의 기본 묶음 단위입니다. 모든 노트는 `issue` 필드로 이슈에 연결되고,
이슈 YAML의 `includedNotes`(collection + slug + order)가 수록 순서를 결정합니다.

| 컬렉션 | 경로 | 포맷 | 비고 |
|---|---|---|---|
| essays | `src/content/essays/*.mdx` | MDX | ESSAY |
| interviews | `src/content/interviews/*.mdx` | MDX | `interviewKind: relay \| deep` 으로 한줄 릴레이/심층 구분 |
| field-notes | `src/content/field-notes/*.mdx` | MDX | FIELD NOTE |
| systems | `src/content/systems/*.mdx` | MDX | SYSTEM |
| reports | `src/content/reports/*.mdx` | MDX | REPORT |
| issues | `src/content/issues/*.yaml` | YAML | `status: draft\|published\|archived`, `includedNotes`, `upcomingNotes` |
| people | `src/content/people/*.yaml` | YAML | 인물 아카이브 |
| tools | `src/content/tools/*.yaml` | YAML | 도구 아카이브 |

## 디자인 운영

프론티어노트의 디자인은 세 문서를 기준으로 관리합니다.

- `DESIGN.md` — 색, 타이포그래피, 간격, 컴포넌트 원칙
- `docs/design/content-hierarchy.md` — 전역, 페이지, 상세, 목록의 상위 정보 위계
- `docs/design/content-type-system.md` — Issues, Field Notes, Essays, Reports, Systems, Interviews, People, Tools별 카드/상세/모바일 포맷

UI를 수정할 때는 먼저 어떤 콘텐츠 타입의 위계를 바꾸는지 확인하고, 반복되는 패턴이면
세 문서 중 하나에 규칙을 남깁니다. 공개 UI에는 `i-am-human`, `standalone` 같은 내부 slug를
그대로 노출하지 않고, 이슈 수록 여부는 이슈 YAML의 `includedNotes`를 기준으로 표시합니다.

### 노트 공통 frontmatter

`title`, `subtitle`, `slug`, `date`, `updatedAt`, `type`(essay/interview/field-note/system/report),
`issue`(이슈 slug), `person`, `role`, `company`, `stage`, `tools`, `themes`, `signals`,
`location`, `related_people`, `related_tools`, `next_questions`, `series`,
`featured`, `order`(목록 수동 정렬, 작은 숫자 우선, 비우면 발행일 역순), `draft`,
`showInRecentNotes`, `coverImage`, `ogImage`

### 인터뷰 전용

- `interviewKind: relay` — 한줄 릴레이 인터뷰 (기본값, 비우면 relay로 처리)
- `interviewKind: deep` — 심층 인터뷰 (예: `/interviews/bot-coach`)

### 정렬 규칙

- 기본: `date`(발행일) 내림차순
- 수동 큐레이션 목록(릴레이 인터뷰 등): `order` 오름차순 우선, 나머지는 발행일 역순
- 이슈 수록 글: `includedNotes[].order` 오름차순

### 공개/비공개 규칙

- 노트: `draft: true`는 빌드(목록·상세)에서 제외. 로컬 확인은 `SHOW_DRAFTS=true npm run dev`
- 이슈: `status: published`만 공개 (`status`가 없으면 하위 호환으로 `hidden: false` 기준)

## 라우트

`/` · `/issues` · `/issues-01`(이슈 랜딩, 이슈의 `publicPath`) · `/essays` · `/interviews`
· `/field-notes` · `/systems` · `/reports` · `/notes` · `/people` · `/tools` · `/about`
· `/interview-proposal` · `/<collection>/<slug>` 상세 · `/keystatic` 어드민

## 로컬 실행

```bash
npm install
npm run dev          # http://127.0.0.1:4321
```

로컬 어드민(Keystatic, local 모드 — 파일 직접 수정):

```bash
npm run admin:open   # 백그라운드 서버 + 브라우저 오픈
npm run admin:stop
# 또는 npm run dev 후 http://127.0.0.1:4321/keystatic
```

## 빌드

```bash
npm run check        # 공개 안전성 + 콘텐츠 링크 + 어드민 구조 + 타입 체크
npm run check:public
npm run typecheck
npm run build        # 공개 사이트용 완전 정적 빌드 (ENABLE_KEYSTATIC=false, /keystatic 없음)
npm run build:admin  # 어드민용 빌드 (ENABLE_KEYSTATIC=true, /keystatic 서버 라우트 활성화)
```

## 공개 저장소 운영

이 저장소는 언제든 공개할 수 있는 상태를 기준으로 관리합니다. 새 글, 인물 아카이브,
오타 수정, 공개 메타데이터 보강은 pull request로 받을 수 있습니다.

- 기여 가이드: `CONTRIBUTING.md`
- 공개 전 점검: `npm run check:public`
- 비밀값은 `.env.local` 또는 배포 플랫폼 환경변수에만 보관하고 커밋하지 않습니다
- `.env.example`에는 필요한 환경변수 이름만 둡니다

## 프로덕션 어드민 (/keystatic) 설정

Keystatic은 빌드 모드에 따라 스토리지가 전환됩니다 (`keystatic.config.ts`):

- 개발: `local` — 파일을 직접 수정
- 프로덕션 빌드: `github` — GitHub App OAuth 로그인 후 **GitHub 커밋으로 저장**

권장 배포 구조:

- 공개 사이트: `https://frontiernote.com`, Build Command `npm run build`, `/keystatic` 없음
- 어드민 사이트: 별도 Vercel 프로젝트/도메인(예: `admin.frontiernote.com`), Build Command `npm run build:admin`, `/keystatic` 활성화

`npm run build:full`은 기존 운영 문서와 호환하기 위한 `npm run build:admin` 별칭입니다.

저장 흐름:

```
/keystatic 편집 → GitHub 커밋 (berkshirehathaways/frontier-notes) → Vercel 재빌드 → 공개 사이트 반영
```

쓰기 권한은 GitHub 저장소 권한을 그대로 따릅니다. 저장소에 write 권한이 없는 사용자는
로그인해도 저장할 수 없으므로 어드민이 공개적으로 쓰기 가능해지지 않습니다.

### 1. GitHub App 만들기

가장 쉬운 방법: 로컬에서 GitHub 모드로 한 번 띄우면 Keystatic이 App 생성을 안내합니다.

```bash
npm run build:admin && npm run preview
# http://127.0.0.1:4321/keystatic 접속 → "Create GitHub App" 플로우를 따라가면
# .env에 아래 환경변수가 자동 기록됩니다.
```

수동으로 만들 경우 GitHub → Settings → Developer settings → GitHub Apps:

- Callback URL: `https://<admin-host>/api/keystatic/github/oauth/callback`
- 같은 도메인에 어드민을 함께 둘 때만 `https://frontiernote.com/api/keystatic/github/oauth/callback`
- (로컬 preview 테스트용으로 `http://127.0.0.1:4321/api/keystatic/github/oauth/callback` 추가 가능)
- 권한: Repository permissions → Contents: Read & write, Metadata: Read-only
- App을 `berkshirehathaways/frontier-notes` 저장소에 설치

### 2. Vercel 환경변수 (Production)

| 변수 | 값 |
|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub App의 Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub App의 Client Secret |
| `KEYSTATIC_SECRET` | 임의의 긴 랜덤 문자열 (`openssl rand -hex 32`) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | GitHub App slug (URL에 보이는 이름) |

비밀값은 절대 커밋하지 않습니다. `.env`는 `.gitignore`에 포함되어 있습니다.

### 3. Vercel 빌드 커맨드 분리

공개 사이트 프로젝트는 Build Command를 `npm run build`로 유지합니다. 이 빌드는 완전 정적 사이트로
배포되고 `/keystatic`은 존재하지 않습니다(어댑터·서버 함수 없음).

어드민 프로젝트는 같은 저장소를 연결하되 Build Command를 `npm run build:admin`으로 설정합니다. 이 빌드에서만
Vercel 어댑터와 Keystatic 서버 라우트가 켜집니다. 어떤 쪽이든 공개 페이지는 전부 정적 프리렌더링됩니다.

### 4. 배포 후 확인 사항

- 어드민 도메인의 `/keystatic` 접속 → GitHub 로그인 → 편집 → 저장 시 커밋 생성 확인
- 커밋 후 Vercel이 자동 재빌드하고 사이트에 반영되는지 확인

## SEO / OG

- 메타데이터는 `src/layouts/BaseLayout.astro`에 중앙화: title 패턴, description, canonical,
  Open Graph(og:type 포함), Twitter card, 상세 페이지의 `article:published_time`
- OG 이미지 우선순위: frontmatter `ogImage` → `coverImage` → `/og-default.png`
- 기본 OG 이미지는 `the future is nowhere` / `the future is now here` 두 읽기를
  하이라이트와 공백으로 함께 보여줍니다
- 기본 OG는 SNS 크롤러 호환성을 위해 1200×630 PNG를 사용합니다

## 이미지 업로드

- 커버/OG/본문 이미지는 `public/uploads/**` 아래 실제 존재하는 파일만 참조합니다
- 권장: webp, 썸네일 1200×675(≤300KB), 본문 이미지 ≤1600px(≤700KB)

## 새 글 작성 (어드민 기준)

1. `/keystatic` 접속 (로컬 또는 프로덕션)
2. Notes(essays/interviews/field-notes/systems/reports) 또는 Issues/Data(people/tools)에서 생성
3. `draft: false` + (이슈는 `status: published`)로 발행
4. 이슈에 수록하려면 해당 이슈의 `includedNotes`에 collection/slug/order 추가
