import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const clusterId = params.id;
    const sb = createServerClient();

    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: cluster, error } = await sb
      .from("clusters").select("*").eq("id", clusterId).single();

    if (error) throw error;

    const { data: members } = await sb
      .from("cluster_members").select("*, profiles(id, name, email, suburb, postcode, lat, lng, approximate_location, household_size, languages, onboarding_complete, created_at)").eq("cluster_id", clusterId);

    return NextResponse.json({
      ...cluster,
      gaps: typeof cluster.gaps === "string" ? JSON.parse(cluster.gaps) : cluster.gaps,
      members: members || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get cluster";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
