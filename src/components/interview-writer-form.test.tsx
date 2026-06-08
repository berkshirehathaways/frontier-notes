/** @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InterviewWriterForm } from "./interview-writer-form";

describe("InterviewWriterForm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders recording, transcribe, generate, and copy controls", () => {
    render(<InterviewWriterForm />);

    expect(screen.getByRole("button", { name: /start recording/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /stop recording/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /transcribe audio/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /generate markdown/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /copy markdown/i })).toBeDefined();
  });

  it("can generate markdown directly from pasted transcript without transcription", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          markdown: "# Draft markdown",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    render(<InterviewWriterForm />);

    fireEvent.change(screen.getByLabelText(/access token/i), {
      target: {
        value: "studio-token",
      },
    });
    fireEvent.change(screen.getByLabelText(/transcript/i), {
      target: {
        value: "Interview transcript",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /generate markdown/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);

    expect(url).toBe("/api/interview/generate");
    expect(headers.get("x-studio-token")).toBe("studio-token");
    expect(screen.getByText("# Draft markdown")).toBeDefined();
  });

  it("shows loading and user-friendly error message", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "Transcript is required.",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    render(<InterviewWriterForm />);

    fireEvent.change(screen.getByLabelText(/access token/i), {
      target: {
        value: "studio-token",
      },
    });
    fireEvent.change(screen.getByLabelText(/transcript/i), {
      target: {
        value: "Interview transcript",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /generate markdown/i }));

    expect(screen.getByText(/generating/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("Transcript is required.")).toBeDefined();
    });
  });
});
