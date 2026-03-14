import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { type, suburb } = body;

    const crisisId = uuidv4();
    const title = type === "flood"
      ? "Severe Flood Warning — Footscray"
      : "Bushfire Emergency — Footscray";
    const description = type === "flood"
      ? "Maribyrnong River has breached its banks. Flooding in low-lying areas of Footscray. Evacuate if near the river."
      : "Bushfire approaching from the west. Extreme fire danger. Leave early if in affected areas.";

    const crisisEvent = {
      id: crisisId,
      title,
      description,
      severity: "emergency" as const,
      affected_postcodes: ["3011"],
      status: "active" as const,
      created_at: new Date().toISOString(),
    };

    const sb = createServerClient();
    if (sb) {
      await sb.from("crisis_events").insert(crisisEvent);
      await sb.from("clusters").update({ status: "crisis" }).eq("suburb", suburb || "Footscray");
    }

    return NextResponse.json({
      crisisEvent,
      affectedClusters: [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Crisis simulation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
