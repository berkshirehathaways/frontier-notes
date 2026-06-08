export type GeneratePayload = {
  person: string;
  role: string;
  project: string;
  keywords: string;
  direction: string;
  transcript: string;
};

export type GenerateValidationResult =
  | {
      ok: true;
      data: GeneratePayload;
    }
  | {
      ok: false;
      status: 400;
      error: string;
    };

export type TranscribeValidationResult =
  | {
      ok: true;
      audio: File;
    }
  | {
      ok: false;
      status: 400;
      error: string;
    };

function normalizeOptionalText(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

export function validateGenerateInput(input: unknown): GenerateValidationResult {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      status: 400,
      error: "Transcript is required.",
    };
  }

  const raw = input as Record<string, unknown>;
  const transcript = typeof raw.transcript === "string" ? raw.transcript.trim() : "";

  if (!transcript) {
    return {
      ok: false,
      status: 400,
      error: "Transcript is required.",
    };
  }

  return {
    ok: true,
    data: {
      person: normalizeOptionalText(raw.person, "인터뷰이"),
      role: normalizeOptionalText(raw.role, "빌더"),
      project: normalizeOptionalText(raw.project, "미정 프로젝트"),
      keywords: normalizeOptionalText(raw.keywords, "미정"),
      direction: normalizeOptionalText(raw.direction, "frontier-notes 톤 유지"),
      transcript,
    },
  };
}

export function validateTranscribeFormData(formData: FormData): TranscribeValidationResult {
  const audio = formData.get("audio");

  if (!(audio instanceof File)) {
    return {
      ok: false,
      status: 400,
      error: "Audio file is required.",
    };
  }

  return {
    ok: true,
    audio,
  };
}
