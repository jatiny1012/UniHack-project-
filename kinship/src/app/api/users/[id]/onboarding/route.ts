import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";
import { fuzzLocation } from "@/lib/utils";

/**
 * POST /api/users/[id]/onboarding
 * Saves onboarding data (name, suburb, lat/lng, raw text, etc.)
 * to the user's profile and sets onboarding_complete = true.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = params.id;
    const body = await req.json();
    const {
      name,
      suburb,
      postcode,
      lat,
      lng,
      approximate_location,
      household_size,
      languages,
      raw_capabilities_text,
      raw_needs_text,
    } = body;

    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Verify user exists
    const { data: existing } = await sb
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fuzz location for privacy
    const fuzzed = fuzzLocation(
      lat || -37.7996,
      lng || 144.8994
    );

    // Update profile with onboarding data
    const { data: updatedProfile, error } = await sb
      .from("profiles")
      .update({
        name: name || undefined,
        suburb: suburb || "Footscray",
        postcode: postcode || "3011",
        lat: fuzzed.lat,
        lng: fuzzed.lng,
        approximate_location: approximate_location || "",
        household_size: household_size || 1,
        languages: languages || ["English"],
        raw_capabilities_text: raw_capabilities_text || "",
        raw_needs_text: raw_needs_text || "",
        onboarding_complete: true,
      })
      .eq("id", userId)
      .select(
        "id, name, email, suburb, postcode, lat, lng, approximate_location, household_size, languages, raw_capabilities_text, raw_needs_text, onboarding_complete, created_at"
      )
      .single();

    if (error) throw error;

    return NextResponse.json({
      profile: updatedProfile,
      onboarding_complete: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save onboarding data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
