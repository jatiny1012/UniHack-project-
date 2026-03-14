import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { hashPassword, signToken } from "@/lib/auth";
import { fuzzLocation } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      suburb,
      postcode,
      lat,
      lng,
      approximate_location,
      household_size,
      languages,
    } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await sb
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Fuzz location for privacy
    const fuzzed = fuzzLocation(lat || -37.7996, lng || 144.8994);

    const userId = uuidv4();
    const { data: profile, error } = await sb
      .from("profiles")
      .insert({
        id: userId,
        email: email.toLowerCase(),
        password_hash,
        name,
        suburb: suburb || "Footscray",
        postcode: postcode || "3011",
        lat: fuzzed.lat,
        lng: fuzzed.lng,
        approximate_location: approximate_location || "",
        household_size: household_size || 1,
        languages: languages || ["English"],
        onboarding_complete: false,
      })
      .select(
        "id, name, email, suburb, postcode, lat, lng, approximate_location, household_size, languages, onboarding_complete, created_at"
      )
      .single();

    if (error) throw error;

    // Generate JWT token
    const token = signToken({ user_id: userId, email: email.toLowerCase() });

    return NextResponse.json(
      {
        user_id: userId,
        token,
        profile,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    console.error("Register error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
