# Frontier Notes - Claude Code Handoff

## 1) 프로젝트 목적
- 프로젝트명: `frontier-notes`
- 사이트명: `최전선 노트 (Frontier Notes)`
- 성격: 단순 블로그가 아니라, AI native 빌더의 `사람/도구/현장 신호`를 축적하고 재분류하는 기술 매거진 시스템.

## 2) 현재 핵심 요구사항 (고정)
아래 5개가 MVP 핵심 기능이며, 빠지면 안 됨.

1. CMS 기반 콘텐츠 작성/수정 (Keystatic 우선)
2. People 데이터베이스
3. Tools 데이터베이스
4. 뉴스레터 구독 + 아카이브
5. 빌더 추천/인터뷰 제안 폼

금지사항:
- 외부 DB, 유료 CMS, 유료 검색, 유료 이미지 저장소, 로그인/결제/댓글, 서버 함수 기본 도입 금지.

## 3) 현재 구현 상태 요약
- Astro + TypeScript + MDX + Content Collections + Keystatic 기반으로 구조 생성됨.
- 섹션/페이지 대다수 존재:
  - Home, Issues, Essays, Interviews, Field Notes, Systems, Reports, About
  - Notes Explorer, People, Tools, Newsletter Archive, Interview Proposal
- 샘플 콘텐츠 및 데이터 컬렉션이 들어가 있음.
- Vercel 배포 URL: `https://frontier-notes.vercel.app`

## 4) 현재 가장 큰 문제 (사용자 피드백)
사용자 피드백 요지:
- "Increment 스타일 느낌이 전혀 아니다."
- "예쁜 템플릿도 중요하다."
- "블로그 카드 모음이 아니라 기술 매거진 에디토리얼 톤이 강해야 한다."

즉, 기능보다 현재는 **디자인 톤/편집 구조 불일치**가 최우선 이슈.

## 5) 디자인 재작업 지침 (최우선)
레퍼런스 방향:
- Increment 같은 기술 매거진 레이아웃/톤을 강하게 반영.
- 전체 해커 터미널 UI 금지.
- 터미널 감성은 메타데이터/라벨/태그에만 제한.

디자인 핵심:
1. 박스형 카드 남발 축소 (특히 홈 상단/중단)
2. 얇은 룰(line) 기반의 에디토리얼 구획
3. 타이포 위계 강화 (헤드라인/서브헤드/메타 간 대비 확대)
4. 정보 밀도는 높되, 과한 장식/애니메이션 제거
5. 본문 가독성 최우선 (긴 글 기준)

## 6) Claude Code 실행 우선순위
1. `src/pages/index.astro` 레이아웃을 에디토리얼 형태로 재구성
2. `src/styles/global.css`에서 카드/버튼/보더 스타일 축소 및 룰 기반 리듬 강화
3. `src/layouts/BaseLayout.astro` 헤더/유틸리티/메인 내비를 더 미니멀하게 정렬
4. 섹션 헤딩/카드 컴포넌트(`src/components/*`)의 타이포 스케일 조정
5. 모바일(1열), 데스크톱(2~3열) 반응형 검증

## 7) 검증 체크리스트
아래를 모두 통과해야 완료:

1. `npm install`
2. `npm run dev`
3. `npm run build`
4. 빌드 오류 0
5. 샘플 글 상세 페이지 접근 가능
6. 목록 페이지 접근 가능
7. 관리자 화면(`/keystatic`) 접근 가능
8. 모바일 레이아웃 깨짐 없음

## 8) 전달 메모
- 현재 브랜치는 최초 커밋 이후 변경분이 매우 큼.
- 작업 시 기능 회귀(특히 People/Tools/Newsletter/Proposal)가 발생하지 않게 디자인 리팩터링 우선으로 진행.
- 사용자 기대치는 "영감" 수준이 아니라 **Increment 톤의 강한 재현**에 가까움.
