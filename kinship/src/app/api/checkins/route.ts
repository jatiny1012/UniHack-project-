import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, cluster_id, crisis_event_id, status, message, lat, lng } = body;

    const checkIn = {
      id: uuidv4(),
      user_id,
      cluster_id,
      crisis_event_id,
      status,
      message: message || "",
      lat,
      lng,
      timestamp: new Date().toISOString(),
    };

    const sb = createServerClient();
    if (sb) {
      const { error } = await sb.from("checkins").insert(checkIn);
      if (error) throw error;
    }

    return NextResponse.json(checkIn);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Check-in failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clusterId = searchParams.get("cluster_id");

    if (!clusterId) {
      return NextResponse.json({ error: "Missing cluster_id" }, { status: 400 });
    }

    const sb = createServerClient();
    if (sb) {
      const { data, error } = await sb
        .from("checkins")
        .select("*, profiles(name)")
        .eq("cluster_id", clusterId)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    return NextResponse.json([]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to get check-ins";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
