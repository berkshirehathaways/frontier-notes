export type TokenVerificationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      status: 401 | 500;
      error: string;
    };

type EnvLike = Record<string, string | undefined>;

export function verifyStudioToken(
  headers: Headers,
  env: EnvLike = process.env,
): TokenVerificationResult {
  const expectedToken = env.STUDIO_ACCESS_TOKEN;

  if (!expectedToken) {
    return {
      ok: false,
      status: 500,
      error: "STUDIO_ACCESS_TOKEN is not configured.",
    };
  }

  const incomingToken = headers.get("x-studio-token");

  if (!incomingToken) {
    return {
      ok: false,
      status: 401,
      error: "Missing x-studio-token header.",
    };
  }

  if (incomingToken !== expectedToken) {
    return {
      ok: false,
      status: 401,
      error: "Invalid studio token.",
    };
  }

  return {
    ok: true,
  };
}
