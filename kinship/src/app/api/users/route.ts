import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";
import { fuzzLocation } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { name, suburb, postcode, lat, lng, approximate_location, household_size, languages } = body;

    const fuzzed = fuzzLocation(lat, lng);
    const userId = uuidv4();

    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: profile, error: profileError } = await sb
      .from("profiles").select("id, name, email, suburb, postcode, lat, lng, approximate_location, household_size, languages, onboarding_complete, created_at").eq("id", id).single();
    if (profileError) throw profileError;

    const { data: capabilities } = await sb
      .from("capabilities").select("*").eq("user_id", id);
    const { data: needs } = await sb
      .from("needs").select("*").eq("user_id", id);

    return NextResponse.json({ profile, capabilities: capabilities || [], needs: needs || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
