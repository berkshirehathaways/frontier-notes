import { describe, expect, it } from "vitest";

import { buildInterviewPrompts } from "./prompt";

describe("buildInterviewPrompts", () => {
  it("includes required prompt constraints and markdown structure", () => {
    const prompts = buildInterviewPrompts({
      person: "홍길동",
      role: "Founder",
      project: "Frontier Lab",
      keywords: "distribution, tooling",
      direction: "실무 관찰 중심",
      transcript: "인터뷰 transcript 본문",
    });

    expect(prompts.systemPrompt).toContain("frontier-notes의 편집자");
    expect(prompts.systemPrompt).toContain("Q&A 형식 금지");
    expect(prompts.systemPrompt).toContain("홍보문 금지");
    expect(prompts.systemPrompt).toContain("회의록 말투 금지");
    expect(prompts.systemPrompt).toContain("추상어 남발 금지");
    expect(prompts.systemPrompt).toContain("한자 사용 금지");

    expect(prompts.userPrompt).toContain("category: interview");
    expect(prompts.userPrompt).toContain("title");
    expect(prompts.userPrompt).toContain("description");
    expect(prompts.userPrompt).toContain("date");
    expect(prompts.userPrompt).toContain("person");
    expect(prompts.userPrompt).toContain("role");
    expect(prompts.userPrompt).toContain("project");
    expect(prompts.userPrompt).toContain("signals");
    expect(prompts.userPrompt).toContain("tags");

    expect(prompts.userPrompt).toContain("# 제목");
    expect(prompts.userPrompt).toContain("도입부");
    expect(prompts.userPrompt).toContain("## 첫 번째 신호");
    expect(prompts.userPrompt).toContain("## 판을 만든다는 것");
    expect(prompts.userPrompt).toContain("## 회사가 되기 전의 움직임");
    expect(prompts.userPrompt).toContain("## 피치덱 전에 보이는 것");
    expect(prompts.userPrompt).toContain("## 아직 이름 붙지 않은 방식");
  });
});
