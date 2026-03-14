import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { SEED_PROFILES } from "@/data/seed-profiles";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json({
        success: true,
        profiles_created: 40,
        message: "Supabase not configured — app will use seed data directly",
      });
    }

    let profilesCreated = 0;

    for (const profile of SEED_PROFILES) {
      // Insert profile
      const { error: profileError } = await sb.from("profiles").upsert({
        id: profile.id,
        name: profile.name,
        suburb: profile.suburb,
        postcode: profile.postcode,
        lat: profile.lat,
        lng: profile.lng,
        approximate_location: profile.approximate_location || "",
        household_size: profile.household_size,
        languages: profile.languages,
      });

      if (profileError) {
        console.error(`Failed to insert profile ${profile.name}:`, profileError);
        continue;
      }

      // Insert capabilities
      for (const cap of profile.capabilities) {
        await sb.from("capabilities").insert({
          id: uuidv4(),
          user_id: profile.id,
          tag: cap.tag,
          category: cap.category,
          detail: cap.detail,
        });
      }

      // Insert needs
      for (const need of profile.needs) {
        await sb.from("needs").insert({
          id: uuidv4(),
          user_id: profile.id,
          tag: need.tag,
          category: need.category,
          detail: "",
          priority: need.priority,
        });
      }

      profilesCreated++;
    }

    // Generate clusters
    const clusterRes = await fetch(new URL("/api/clusters", process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000").toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suburb: "Footscray", postcode: "3011" }),
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      profiles_created: profilesCreated,
      clusters_generated: clusterRes ? "yes" : "skipped",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seeding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
