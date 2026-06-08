import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createFriendliClient: vi.fn(),
  generateMarkdown: vi.fn(),
}));

vi.mock("@/lib/interview/friendli", () => ({
  createFriendliClient: mocks.createFriendliClient,
}));

import { POST } from "./route";

function buildGenerateRequest({
  token,
  payload,
}: {
  token?: string;
  payload: Record<string, unknown>;
}) {
  const headers = new Headers({
    "content-type": "application/json",
  });

  if (token) {
    headers.set("x-studio-token", token);
  }

  return new Request("http://localhost/api/interview/generate", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

describe("POST /api/interview/generate", () => {
  beforeEach(() => {
    vi.stubEnv("STUDIO_ACCESS_TOKEN", "studio-secret");
    vi.stubEnv("FRIENDLI_API_KEY", "friendli-secret");
    vi.stubEnv("FRIENDLI_BASE_URL", "https://api.friendli.ai/serverless/v1");
    vi.stubEnv("EXAONE_MODEL", "LGAI-EXAONE/K-EXAONE-236B-A23B");

    mocks.createFriendliClient.mockReturnValue({
      generateMarkdown: mocks.generateMarkdown,
    });
    mocks.generateMarkdown.mockResolvedValue("---\ncategory: interview\n---\n# 제목");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns 401 before Friendli call when token is wrong", async () => {
    const response = await POST(
      buildGenerateRequest({
        token: "wrong-token",
        payload: {
          transcript: "interview transcript",
        },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Invalid studio token.",
    });
    expect(mocks.createFriendliClient).not.toHaveBeenCalled();
    expect(mocks.generateMarkdown).not.toHaveBeenCalled();
  });

  it("returns 400 when transcript is missing", async () => {
    const response = await POST(
      buildGenerateRequest({
        token: "studio-secret",
        payload: {},
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "Transcript is required.",
    });
    expect(mocks.createFriendliClient).not.toHaveBeenCalled();
  });

  it("returns markdown on success and does not log transcript", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const response = await POST(
      buildGenerateRequest({
        token: "studio-secret",
        payload: {
          transcript: "interview transcript",
          person: "홍길동",
        },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      markdown: "---\ncategory: interview\n---\n# 제목",
    });
    expect(mocks.createFriendliClient).toHaveBeenCalledTimes(1);
    expect(mocks.generateMarkdown).toHaveBeenCalledTimes(1);
    expect(logSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });
});
