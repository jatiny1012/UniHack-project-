import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";

/**
 * GET /api/users/[id]
 * Returns the full user profile including parsed capabilities, needs,
 * cluster membership, and onboarding status.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = params.id;
    const sb = createServerClient();

    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Get profile (exclude password_hash)
    const { data: profile, error: profileError } = await sb
      .from("profiles")
      .select(
        "id, name, email, suburb, postcode, lat, lng, approximate_location, household_size, languages, raw_capabilities_text, raw_needs_text, onboarding_complete, created_at"
      )
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get parsed capabilities
    const { data: capabilities } = await sb
      .from("capabilities")
      .select("id, user_id, tag, category, detail")
      .eq("user_id", userId);

    // Get parsed needs
    const { data: needs } = await sb
      .from("needs")
      .select("id, user_id, tag, category, detail, priority")
      .eq("user_id", userId);

    // Get cluster membership
    const { data: membership } = await sb
      .from("cluster_members")
      .select("cluster_id")
      .eq("user_id", userId)
      .single();

    let cluster = null;
    if (membership) {
      const { data: clusterData } = await sb
        .from("clusters")
        .select("id, name, suburb, resilience_score, status")
        .eq("id", membership.cluster_id)
        .single();
      cluster = clusterData;
    }

    return NextResponse.json({
      profile,
      capabilities: capabilities || [],
      needs: needs || [],
      cluster,
      onboarding_complete: profile.onboarding_complete || false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
