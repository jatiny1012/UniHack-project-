import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type AuthPayload } from "./auth";

/**
 * Authenticate an incoming API request.
 * Extracts the JWT from the Authorization header and verifies it.
 *
 * Returns the decoded AuthPayload on success, or a NextResponse (401) on failure.
 * Usage:
 *   const auth = await authenticateRequest(req);
 *   if (auth instanceof NextResponse) return auth;
 *   // auth is now AuthPayload with { user_id, email }
 */
export function authenticateRequest(
  req: NextRequest
): AuthPayload | NextResponse {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing authorization header" },
      { status: 401 }
    );
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return NextResponse.json(
      { error: "Invalid authorization format. Use: Bearer <token>" },
      { status: 401 }
    );
  }

  try {
    const payload = verifyToken(parts[1]);
    return payload;
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
