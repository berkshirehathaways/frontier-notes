import type { GeneratePayload } from "./validation";

export function buildInterviewPrompts(input: GeneratePayload): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = [
    "당신은 frontier-notes의 편집자입니다.",
    "인터뷰를 기사처럼 요약하지 말고 작업 방식과 판단 신호를 재구성하세요.",
    "Q&A 형식 금지.",
    "홍보문 금지.",
    "회의록 말투 금지.",
    "AI, 혁신, 미래 같은 추상어 남발 금지.",
    "자연스러운 한국어를 사용하세요.",
    "한자 사용 금지.",
    "frontmatter 포함 markdown 하나만 반환하세요.",
  ].join("\n");

  const userPrompt = [
    "다음 인터뷰 정보를 바탕으로 frontier-notes 톤의 글을 작성하세요.",
    "",
    "메타 정보",
    `- person: ${input.person}`,
    `- role: ${input.role}`,
    `- project: ${input.project}`,
    `- keywords: ${input.keywords}`,
    `- direction: ${input.direction}`,
    "",
    "frontmatter 필드 요구사항",
    "title",
    "description",
    "date",
    "category: interview",
    "person",
    "role",
    "project",
    "signals",
    "tags",
    "",
    "본문 구조",
    "# 제목",
    "도입부",
    "## 첫 번째 신호",
    "## 판을 만든다는 것",
    "## 회사가 되기 전의 움직임",
    "## 피치덱 전에 보이는 것",
    "## 아직 이름 붙지 않은 방식",
    "",
    "인터뷰 transcript",
    input.transcript,
  ].join("\n");

  return {
    systemPrompt,
    userPrompt,
  };
}
