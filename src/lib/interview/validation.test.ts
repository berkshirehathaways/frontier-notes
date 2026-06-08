import { describe, expect, it } from "vitest";

import { validateGenerateInput, validateTranscribeFormData } from "./validation";

describe("validateGenerateInput", () => {
  it("returns 400 when transcript is missing", () => {
    const result = validateGenerateInput({});

    expect(result).toEqual({
      ok: false,
      status: 400,
      error: "Transcript is required.",
    });
  });

  it("applies safe defaults to optional fields", () => {
    const result = validateGenerateInput({
      transcript: "A short transcript",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        person: "인터뷰이",
        role: "빌더",
        project: "미정 프로젝트",
        keywords: "미정",
        direction: "frontier-notes 톤 유지",
        transcript: "A short transcript",
      },
    });
  });
});

describe("validateTranscribeFormData", () => {
  it("returns 400 when audio file is missing", () => {
    const result = validateTranscribeFormData(new FormData());

    expect(result).toEqual({
      ok: false,
      status: 400,
      error: "Audio file is required.",
    });
  });
});
