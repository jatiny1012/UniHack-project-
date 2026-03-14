import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { fuzzLocation } from "@/lib/utils";
import { SEED_PROFILES } from "@/data/seed-profiles";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, suburb, postcode, lat, lng, approximate_location, household_size, languages } = body;

    const fuzzed = fuzzLocation(lat, lng);
    const userId = uuidv4();

    const sb = createServerClient();
    if (sb) {
      const { data, error } = await sb.from("profiles").insert({
        id: userId,
        name,
        suburb: suburb || "Footscray",
        postcode: postcode || "3011",
        lat: fuzzed.lat,
        lng: fuzzed.lng,
        approximate_location,
        household_size: household_size || 1,
        languages: languages || ["English"],
      }).select().single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Fallback: return a mock profile
    const profile = {
      id: userId,
      name,
      suburb: suburb || "Footscray",
      postcode: postcode || "3011",
      lat: fuzzed.lat,
      lng: fuzzed.lng,
      approximate_location,
      household_size: household_size || 1,
      languages: languages || ["English"],
      created_at: new Date().toISOString(),
    };
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const sb = createServerClient();
    if (sb) {
      const { data: profile, error: profileError } = await sb
        .from("profiles").select("*").eq("id", id).single();
      if (profileError) throw profileError;

      const { data: capabilities } = await sb
        .from("capabilities").select("*").eq("user_id", id);
      const { data: needs } = await sb
        .from("needs").select("*").eq("user_id", id);

      return NextResponse.json({ profile, capabilities: capabilities || [], needs: needs || [] });
    }

    // Fallback: use seed data
    const seedProfile = SEED_PROFILES.find((p) => p.id === id);
    if (seedProfile) {
      return NextResponse.json({
        profile: { ...seedProfile, created_at: new Date().toISOString() },
        capabilities: seedProfile.capabilities.map((c, i) => ({ id: `cap-${id}-${i}`, user_id: id, ...c })),
        needs: seedProfile.needs.map((n, i) => ({ id: `need-${id}-${i}`, user_id: id, detail: "", ...n })),
      });
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
