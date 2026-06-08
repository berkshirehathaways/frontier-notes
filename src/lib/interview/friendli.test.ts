import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createFriendliClient } from "./friendli";

describe("createFriendliClient", () => {
  it("throws a safe error when FRIENDLI_API_KEY is missing", () => {
    expect(() =>
      createFriendliClient({
        env: {},
      }),
    ).toThrowError("FRIENDLI_API_KEY is not configured.");
  });

  it("calls Friendli audio transcription endpoint and returns transcript text", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          text: "hello transcript",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const client = createFriendliClient({
      env: {
        FRIENDLI_API_KEY: "test-key",
        FRIENDLI_BASE_URL: "https://api.friendli.ai/serverless/v1",
        TRANSCRIBE_MODEL: "openai/whisper-large-v3",
        EXAONE_MODEL: "LGAI-EXAONE/K-EXAONE-236B-A23B",
      },
      fetchImpl: fetchMock as typeof fetch,
    });

    const transcript = await client.transcribeAudio(
      new File(["audio"], "test.webm", {
        type: "audio/webm",
      }),
    );

    expect(transcript).toBe("hello transcript");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    const body = init.body as FormData;

    expect(url).toBe("https://api.friendli.ai/serverless/v1/audio/transcriptions");
    expect(init.method).toBe("POST");
    expect(headers.get("authorization")).toBe("Bearer test-key");
    expect(body.get("model")).toBe("openai/whisper-large-v3");
  });

  it("calls K-EXAONE chat completions and returns markdown", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: "---\\ncategory: interview\\n---\\n# 제목",
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const client = createFriendliClient({
      env: {
        FRIENDLI_API_KEY: "test-key",
        FRIENDLI_BASE_URL: "https://api.friendli.ai/serverless/v1",
        TRANSCRIBE_MODEL: "openai/whisper-large-v3",
        EXAONE_MODEL: "LGAI-EXAONE/K-EXAONE-236B-A23B",
      },
      fetchImpl: fetchMock as typeof fetch,
    });

    const markdown = await client.generateMarkdown({
      systemPrompt: "system prompt",
      userPrompt: "user prompt",
    });

    expect(markdown).toContain("category: interview");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    const body = JSON.parse(String(init.body)) as {
      model: string;
      messages: Array<{ role: string; content: string }>;
    };

    expect(url).toBe("https://api.friendli.ai/serverless/v1/chat/completions");
    expect(init.method).toBe("POST");
    expect(headers.get("authorization")).toBe("Bearer test-key");
    expect(headers.get("content-type")).toBe("application/json");
    expect(body.model).toBe("LGAI-EXAONE/K-EXAONE-236B-A23B");
    expect(body.messages).toHaveLength(2);
  });
});
