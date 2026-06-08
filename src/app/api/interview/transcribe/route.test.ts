import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createFriendliClient: vi.fn(),
  transcribeAudio: vi.fn(),
}));

vi.mock("@/lib/interview/friendli", () => ({
  createFriendliClient: mocks.createFriendliClient,
}));

import { POST } from "./route";

function buildTranscribeRequest({
  token,
  includeAudio = true,
}: {
  token?: string;
  includeAudio?: boolean;
}) {
  const formData = new FormData();

  if (includeAudio) {
    formData.set(
      "audio",
      new File(["audio"], "recording.webm", {
        type: "audio/webm",
      }),
    );
  }

  const headers = new Headers();
  if (token) {
    headers.set("x-studio-token", token);
  }

  return new Request("http://localhost/api/interview/transcribe", {
    method: "POST",
    headers,
    body: formData,
  });
}

describe("POST /api/interview/transcribe", () => {
  beforeEach(() => {
    vi.stubEnv("STUDIO_ACCESS_TOKEN", "studio-secret");
    vi.stubEnv("FRIENDLI_API_KEY", "friendli-secret");
    vi.stubEnv("FRIENDLI_BASE_URL", "https://api.friendli.ai/serverless/v1");
    vi.stubEnv("TRANSCRIBE_MODEL", "openai/whisper-large-v3");

    mocks.createFriendliClient.mockReturnValue({
      transcribeAudio: mocks.transcribeAudio,
    });
    mocks.transcribeAudio.mockResolvedValue("transcribed text");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns 401 before Friendli call when token is wrong", async () => {
    const response = await POST(
      buildTranscribeRequest({
        token: "wrong-token",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Invalid studio token.",
    });
    expect(mocks.createFriendliClient).not.toHaveBeenCalled();
    expect(mocks.transcribeAudio).not.toHaveBeenCalled();
  });

  it("returns 400 when audio is missing", async () => {
    const response = await POST(
      buildTranscribeRequest({
        token: "studio-secret",
        includeAudio: false,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "Audio file is required.",
    });
    expect(mocks.createFriendliClient).not.toHaveBeenCalled();
  });

  it("returns transcript only on success", async () => {
    const response = await POST(
      buildTranscribeRequest({
        token: "studio-secret",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      transcript: "transcribed text",
    });
    expect(mocks.createFriendliClient).toHaveBeenCalledTimes(1);
    expect(mocks.transcribeAudio).toHaveBeenCalledTimes(1);
  });
});
