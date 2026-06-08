import { verifyStudioToken } from "@/lib/interview/auth";
import { createFriendliClient } from "@/lib/interview/friendli";
import { buildInterviewPrompts } from "@/lib/interview/prompt";
import { validateGenerateInput } from "@/lib/interview/validation";

export const runtime = "nodejs";

function asErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected server error.";
}

export async function POST(request: Request): Promise<Response> {
  const authResult = verifyStudioToken(request.headers);

  if (!authResult.ok) {
    return Response.json(
      {
        error: authResult.error,
      },
      { status: authResult.status },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        error: "Invalid JSON payload.",
      },
      { status: 400 },
    );
  }

  const validation = validateGenerateInput(payload);

  if (!validation.ok) {
    return Response.json(
      {
        error: validation.error,
      },
      { status: validation.status },
    );
  }

  try {
    const client = createFriendliClient();
    const prompts = buildInterviewPrompts(validation.data);
    const markdown = await client.generateMarkdown({
      systemPrompt: prompts.systemPrompt,
      userPrompt: prompts.userPrompt,
    });

    return Response.json({
      markdown,
    });
  } catch (error) {
    return Response.json(
      {
        error: asErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
