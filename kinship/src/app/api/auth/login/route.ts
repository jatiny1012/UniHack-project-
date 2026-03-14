import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // Look up user by email
    const { data: user, error: userError } = await sb
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const passwordValid = await comparePassword(password, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      user_id: user.id,
      email: user.email,
    });

    // Build response — never expose password_hash
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      suburb: user.suburb,
      postcode: user.postcode,
      lat: user.lat,
      lng: user.lng,
      approximate_location: user.approximate_location,
      household_size: user.household_size,
      languages: user.languages,
      onboarding_complete: user.onboarding_complete,
      created_at: user.created_at,
    };

    // If onboarding is complete, also fetch capabilities, needs, and cluster
    let capabilities = null;
    let needs = null;
    let cluster = null;

    if (user.onboarding_complete) {
      const { data: caps } = await sb
        .from("capabilities")
        .select("*")
        .eq("user_id", user.id);
      capabilities = caps || [];

      const { data: nds } = await sb
        .from("needs")
        .select("*")
        .eq("user_id", user.id);
      needs = nds || [];

      // Find user's cluster
      const { data: membership } = await sb
        .from("cluster_members")
        .select("cluster_id")
        .eq("user_id", user.id)
        .single();

      if (membership) {
        const { data: clusterData } = await sb
          .from("clusters")
          .select("*")
          .eq("id", membership.cluster_id)
          .single();
        cluster = clusterData || null;
      }
    }

    return NextResponse.json({
      user_id: user.id,
      token,
      profile,
      onboarding_complete: user.onboarding_complete || false,
      ...(capabilities && { capabilities }),
      ...(needs && { needs }),
      ...(cluster && { cluster }),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("Login error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
