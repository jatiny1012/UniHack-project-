import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { SEED_PROFILES } from "@/data/seed-profiles";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
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

    // Generate mock check-ins from the key characters
    const keyProfiles = SEED_PROFILES.slice(0, 6);
    const mockStatuses: Array<{ status: string; message: string; delay: number }> = [
      { status: "safe", message: "All good here, doors locked up", delay: 0 },
      { status: "need_help", message: "Water rising near Barkly St, can't get out", delay: 1500 },
      { status: "safe", message: "", delay: 3000 },
      { status: "helping_others", message: "Checking on elderly neighbours", delay: 4500 },
      { status: "safe", message: "Treating a minor injury at Raj's house", delay: 6000 },
    ];

    const mockCheckIns = keyProfiles.slice(0, 5).map((p, i) => ({
      id: uuidv4(),
      user_id: p.id,
      user_name: p.name,
      cluster_id: "simulation",
      crisis_event_id: crisisId,
      status: mockStatuses[i].status,
      message: mockStatuses[i].message,
      lat: p.lat,
      lng: p.lng,
      timestamp: new Date(Date.now() + mockStatuses[i].delay).toISOString(),
      delay: mockStatuses[i].delay,
    }));

    return NextResponse.json({
      crisisEvent,
      mockCheckIns,
      affectedClusters: [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Crisis simulation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
