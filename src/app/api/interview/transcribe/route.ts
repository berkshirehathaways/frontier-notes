import { verifyStudioToken } from "@/lib/interview/auth";
import { createFriendliClient } from "@/lib/interview/friendli";
import { validateTranscribeFormData } from "@/lib/interview/validation";

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

  const formData = await request.formData();
  const validation = validateTranscribeFormData(formData);

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
    const transcript = await client.transcribeAudio(validation.audio);

    return Response.json({
      transcript,
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
