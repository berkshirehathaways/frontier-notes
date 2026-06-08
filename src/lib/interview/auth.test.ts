import { describe, expect, it } from "vitest";

import { verifyStudioToken } from "./auth";

describe("verifyStudioToken", () => {
  it("returns a safe config error when STUDIO_ACCESS_TOKEN is missing", () => {
    const result = verifyStudioToken(new Headers(), {});

    expect(result).toEqual({
      ok: false,
      status: 500,
      error: "STUDIO_ACCESS_TOKEN is not configured.",
    });
  });

  it("returns 401 when x-studio-token is missing", () => {
    const result = verifyStudioToken(new Headers(), {
      STUDIO_ACCESS_TOKEN: "expected-token",
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      error: "Missing x-studio-token header.",
    });
  });

  it("returns 401 when x-studio-token is wrong", () => {
    const headers = new Headers({
      "x-studio-token": "wrong-token",
    });

    const result = verifyStudioToken(headers, {
      STUDIO_ACCESS_TOKEN: "expected-token",
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      error: "Invalid studio token.",
    });
  });

  it("passes when x-studio-token matches STUDIO_ACCESS_TOKEN", () => {
    const headers = new Headers({
      "x-studio-token": "expected-token",
    });

    const result = verifyStudioToken(headers, {
      STUDIO_ACCESS_TOKEN: "expected-token",
    });

    expect(result).toEqual({
      ok: true,
    });
  });
});
