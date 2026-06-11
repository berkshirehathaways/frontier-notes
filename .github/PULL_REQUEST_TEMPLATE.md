## PR 개요

이 PR이 무엇을 바꾸는지 한두 문장으로 적어 주세요.

### PR 종류

- [ ] People Archive 등록/수정 (`src/content/people/*.yaml`)
- [ ] 노트 콘텐츠 추가/수정 (`src/content/**`)
- [ ] 오타/링크/메타데이터 수정
- [ ] 문서 개선 (README, CONTRIBUTING 등)
- [ ] 기타 (아래에 설명)

### 공통 체크리스트

- [ ] 공개 가능한 정보만 포함했습니다 (비밀값, 비공개 연락처, 로컬 경로 없음).
- [ ] `npm run check:public`을 통과했습니다.
- [ ] 콘텐츠 변경이면 `npm run build`가 성공하는 것을 확인했습니다.

---

## People Archive 등록 시에만 작성

본인 또는 추천 인물을 등록하는 경우 아래를 채워 주세요.

### Checklist

- [ ] `src/content/people/<slug>.yaml` 파일을 새로 추가했습니다.
- [ ] 파일명과 `slug`는 영문 소문자, 숫자, 하이픈만 사용했습니다.
- [ ] 본인 등록이거나, 추천 대상에게 공개 가능 여부를 확인했습니다.
- [ ] 인터뷰 제안 가능 여부를 아래에 표시했습니다.

### Interview availability

- [ ] 인터뷰 제안을 받아도 됩니다.
- [ ] People Archive 등재만 원합니다.
- [ ] 먼저 연락 후 결정하고 싶습니다.

### Suggested YAML format

```yaml
name: 홍길동
slug: hong-gildong
role: AI workflow builder
company: optional-project-or-company
stage: pre-company
tools:
  - Claude Code
  - GitHub
signals:
  - agent-builder
  - vibe-coding
relatedNotes: []
summary: AI 에이전트로 리서치 자동화 워크플로를 만들고 있습니다.
```

### Notes for reviewers

- 왜 이 사람이 노이즈 People Archive에 어울리나요?
- 공개 전에 확인이 필요한 정보가 있나요?
- 연락 가능한 채널이 있다면 적어 주세요 (공개를 원하지 않는 연락처는 PR에 적지 마세요).
