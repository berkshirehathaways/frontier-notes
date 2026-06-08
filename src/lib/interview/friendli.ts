import "server-only";

type FriendliOptions = {
  env?: EnvLike;
  fetchImpl?: typeof fetch;
};

type GenerateRequest = {
  systemPrompt: string;
  userPrompt: string;
};

export type FriendliClient = {
  transcribeAudio: (audio: File) => Promise<string>;
  generateMarkdown: (input: GenerateRequest) => Promise<string>;
};

type EnvLike = Record<string, string | undefined>;

function requiredEnv(
  env: EnvLike,
  key: string,
  fallback?: string,
): string {
  const value = env[key] ?? fallback;

  if (!value) {
    throw new Error(`${key} is not configured.`);
  }

  return value;
}

function parseMessageContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const merged = content
      .map((item) => {
        if (!item || typeof item !== "object") {
          return "";
        }

        const maybeText = (item as { text?: unknown }).text;
        return typeof maybeText === "string" ? maybeText : "";
      })
      .join("")
      .trim();

    if (merged) {
      return merged;
    }
  }

  throw new Error("Invalid response payload from Friendli.");
}

export function createFriendliClient(options: FriendliOptions = {}): FriendliClient {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;

  const apiKey = requiredEnv(env, "FRIENDLI_API_KEY");
  const baseUrl = requiredEnv(
    env,
    "FRIENDLI_BASE_URL",
    "https://api.friendli.ai/serverless/v1",
  );
  const transcribeModel = requiredEnv(
    env,
    "TRANSCRIBE_MODEL",
    "openai/whisper-large-v3",
  );
  const exaoneModel = requiredEnv(
    env,
    "EXAONE_MODEL",
    "LGAI-EXAONE/K-EXAONE-236B-A23B",
  );

  async function transcribeAudio(audio: File): Promise<string> {
    const formData = new FormData();
    formData.set("file", audio);
    formData.set("model", transcribeModel);

    const response = await fetchImpl(`${baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Friendli transcription request failed (${response.status}).`);
    }

    const payload = (await response.json()) as { text?: unknown };
    const text = payload.text;

    if (typeof text !== "string" || !text.trim()) {
      throw new Error("Friendli transcription returned an invalid payload.");
    }

    return text;
  }

  async function generateMarkdown(input: GenerateRequest): Promise<string> {
    const response = await fetchImpl(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: exaoneModel,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: input.systemPrompt,
          },
          {
            role: "user",
            content: input.userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Friendli generation request failed (${response.status}).`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };

    const firstChoice = payload.choices?.[0];
    const content = firstChoice?.message?.content;
    const markdown = parseMessageContent(content);

    if (!markdown.trim()) {
      throw new Error("Friendli generation returned empty markdown.");
    }

    return markdown;
  }

  return {
    transcribeAudio,
    generateMarkdown,
  };
}
