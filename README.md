# frontier-notes

최전선 노트(Frontier Notes) MVP입니다.

- 사이트 이름: 최전선 노트
- 영문 보조명: Frontier Notes
- 부제: AI native generation을 기록하는 기술 매거진
- 핵심 문장:
  - AI를 기본 작업 방식으로 삼는 창업가와 빌더를 인터뷰합니다.
  - 문제의식, 도구, 런타임, 작업 방식을 기록합니다.

## 기술 스택
- Astro + TypeScript + MDX
- Astro Content Collections (타입 안정성)
- Keystatic (Git 기반 CMS)
- 정적 빌드 중심 배포 (Cloudflare Pages Free 또는 Vercel Hobby)

## MVP 핵심 5기능
이 프로젝트는 단순 블로그가 아니라 아래 5개 운영 기능을 기본으로 둡니다.

1. CMS 기반 콘텐츠 작성/수정 (Keystatic)
2. People 데이터베이스
3. Tools 데이터베이스
4. 뉴스레터 구독 UI + 뉴스레터 아카이브
5. 빌더 추천/인터뷰 제안 폼(UI)

## CMS 선택 이유
1순위 요구사항에 맞춰 Keystatic을 적용했습니다.

- Git 기반으로 콘텐츠(문서/데이터)가 그대로 저장소에 남음
- 운영자가 `/keystatic`에서 새 글/수정/데이터 관리 가능
- 외부 DB, 유료 CMS 없이 운영 가능

참고:
- 프로덕션 정적 배포를 위해 `npm run build`는 `SKIP_KEYSTATIC=true`로 관리자 라우트를 제외합니다.
- 로컬 개발에서는 `/keystatic` 관리자 화면을 사용할 수 있습니다.
- 만약 향후 Keystatic 충돌이 크게 발생하면 Decap CMS를 대안으로 검토할 수 있습니다.

## 로컬 실행 방법
```bash
npm install
npm run dev
```

- 사이트: `http://127.0.0.1:4321`
- 관리자: `http://127.0.0.1:4321/keystatic`

## 빌드 방법
```bash
npm run typecheck
npm run build
```

- `npm run build`는 정적 사이트 빌드입니다.
- 결과물은 `dist/`에 생성됩니다.

## 새 글 쓰는 방법
1. `npm run dev` 실행
2. `/keystatic` 접속
3. `Essays / Interviews / Field Notes / Systems / Reports / Newsletter` 중 컬렉션 선택
4. 새 엔트리 생성 후 저장

콘텐츠 파일은 `src/content/<collection>/`에 MDX로 생성됩니다.

## 기존 글 수정 방법
1. `/keystatic`에서 해당 컬렉션/글 선택
2. 본문(MDX) + frontmatter 메타데이터 수정
3. 저장 후 Git 커밋

## 데이터(people/tools/issues) 수정 방법
- `/keystatic`의 `Data` 섹션에서 `issues`, `people`, `tools` 수정
- 파일은 `src/content/issues`, `src/content/people`, `src/content/tools`에 YAML로 저장

## 뉴스레터 작성/아카이브 방법
- `/keystatic`의 `Archive > Newsletter`에서 발행본 작성/수정
- 파일은 `src/content/newsletter/*.mdx`에 저장
- 공개 아카이브는 `/newsletter`, 상세는 `/newsletter/<slug>`에서 확인
- `draft: true`는 공개 목록에서 제외

## 이미지 업로드 방법
권장 저장 경로: `public/uploads`

선택 이유:
- 정적 사이트에서 절대 경로(`/uploads/...`)로 즉시 참조 가능
- Git 기반 관리와 배포 단순성 유지

Keystatic 설정:
- 커버 이미지: `public/uploads/covers`
- 본문 이미지: `public/uploads/content`

권장 규격:
- 카드 썸네일: `1200x675` (16:9)
- 본문 대표 이미지: `1600px` 너비 이하
- 파일 형식: 가능하면 `webp`
- 권장 용량:
  - 썸네일 1장: `300KB` 이하
  - 본문 이미지 1장: `700KB` 이하

## draft 발행 방법
기본 규칙:
- `draft: true`인 글은 공개 목록/정적 빌드에서 제외
- `draft: false`만 공개

로컬에서 draft 확인 옵션:
```bash
SHOW_DRAFTS=true npm run dev -- --host 127.0.0.1 --port 4321
```

## 콘텐츠 frontmatter 설명
모든 노트 타입(essay/interview/field-note/system/report)은 아래 필드를 지원합니다.

- `title`
- `subtitle`
- `slug`
- `date`
- `updatedAt`
- `type`
- `issue`
- `person`
- `role`
- `company`
- `stage`
- `tools`
- `themes`
- `signals`
- `location`
- `related_people`
- `related_tools`
- `next_questions`
- `featured`
- `draft`
- `coverImage`

## 배포 흐름 (GitHub + Cloudflare Pages / Vercel)
1. GitHub 저장소에 push
2. Cloudflare Pages Free 또는 Vercel Hobby에 프로젝트 연결
3. Build command: `npm run build`
4. Output directory: `dist`
5. 배포 완료

## 왜 현재 운영비가 0원인가
- 외부 DB 없음
- 유료 CMS 없음
- 유료 이미지 저장소 없음
- 유료 검색 없음
- 유료 분석 기본 미도입
- 로그인/결제/서버 함수 없음
- 정적 빌드 + Git 저장소 기반 운영

## 어떤 무료 한도에 의존하는가
- GitHub 저장소/Actions 무료 범위
- Cloudflare Pages Free 또는 Vercel Hobby 무료 범위
- 정적 파일 서빙 무료 범위

## 트래픽/콘텐츠 증가 시 비용 위험
- 이미지 용량 증가로 Git 저장소 비대화
- 배포 플랫폼 무료 대역폭/빌드 시간 한도 초과 가능성
- 팀 협업 증가 시 CMS 워크플로 고도화 필요

## 이미지가 많아질 때 repo 용량 관리
1. 업로드 전 압축(webp 우선)
2. 원본 대용량 파일 저장 금지
3. 정기적으로 미사용 이미지 정리
4. 6개월 뒤 전환 조건 문서화
   - 저장소 용량 증가가 개발 속도/클론 속도를 저해할 때
   - 배포 시간 급증 시

## 무료 한도 초과 시 유료 전환 우선순서
1. 이미지 저장 전략 전환(외부 스토리지 검토)
2. 배포 플랜 상향
3. 검색/분석 도구 도입 검토
4. 필요 시 CMS 운영 고도화

## 비용 발생 전 체크리스트
- 외부 DB 도입이 정말 필요한가?
- 현재 문제를 정적 구조/콘텐츠 구조 개선으로 해결 가능한가?
- 이미지 최적화를 먼저 했는가?
- 무료 플랜 한도 수치를 실제로 초과했는가?
- 유료 전환 시 어떤 지표가 개선되는지 명확한가?

## 운영비 0원 체크리스트
- [x] 외부 DB 없음
- [x] 유료 CMS 없음
- [x] 유료 이미지 저장소 없음
- [x] 유료 검색 없음
- [x] 유료 분석 없음
- [x] 로그인 없음
- [x] 결제 없음
- [x] 서버 함수 없음
- [x] 정적 빌드 성공
- [x] Git 기반 콘텐츠 관리 가능
- [x] 무료 배포 플랜에서 동작 가능

## 라우트 개요
- `/` Home
- `/issues`
- `/essays`
- `/interviews`
- `/field-notes`
- `/systems`
- `/reports`
- `/about`
- `/notes` (type/theme/tool 필터)
- `/people`
- `/tools`
- `/newsletter`
- `/newsletter/<slug>`
- `/interview-proposal` (빌더 추천/인터뷰 제안 UI)
- `/<collection>/<slug>` 상세 페이지

## 샘플 콘텐츠
요청된 샘플 5개를 포함해 각 섹션 동작 확인용 샘플을 추가했습니다.
