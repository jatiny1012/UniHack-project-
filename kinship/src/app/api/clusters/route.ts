import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";
import { CLUSTERING_SYSTEM_PROMPT } from "@/lib/matching";
import { haversineDistance } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { suburb, postcode } = body;
    const sb = createServerClient();

    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: dbProfiles } = await sb
      .from("profiles").select("id, name, lat, lng, languages").eq("suburb", suburb || "Footscray");

    let profiles: Array<{
      id: string; name: string; lat: number; lng: number;
      languages: string[];
      capabilities: { tag: string; category: string; detail: string }[];
      needs: { tag: string; category: string; priority: number }[];
    }> = [];

    if (dbProfiles && dbProfiles.length > 0) {
      for (const p of dbProfiles) {
        const { data: caps } = await sb.from("capabilities").select("*").eq("user_id", p.id);
        const { data: nds } = await sb.from("needs").select("*").eq("user_id", p.id);
        profiles.push({
          id: p.id, name: p.name, lat: p.lat, lng: p.lng,
          languages: p.languages || ["English"],
          capabilities: (caps || []).map((c: Record<string, string>) => ({ tag: c.tag, category: c.category, detail: c.detail })),
          needs: (nds || []).map((n: Record<string, string | number>) => ({ tag: n.tag as string, category: n.category as string, priority: n.priority as number })),
        });
      }
    }

    if (profiles.length < 3) {
      return NextResponse.json({ error: "Need at least 3 profiles to form clusters" }, { status: 400 });
    }

    // Try Claude for clustering
    let clusterResults: Array<{
      name: string; member_ids: string[]; resilience_score: number;
      matched_pairs: { need: string; offer: string; strength: string }[];
      gaps: string[]; explanation: string;
    }> = [];

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: CLUSTERING_SYSTEM_PROMPT,
            messages: [{ role: "user", content: JSON.stringify(profiles) }],
          }),
        });

        const data = await response.json();
        const text = data.content?.[0]?.text || "{}";
        const parsed = JSON.parse(text);
        clusterResults = parsed.clusters || [];
      } catch (e) {
        console.error("Claude clustering failed:", e);
      }
    }

    // Fallback: simple distance-based clustering
    if (clusterResults.length === 0) {
      clusterResults = createFallbackClusters(profiles);
    }

    // Delete existing clusters for this suburb
    const { data: existingClusters } = await sb.from("clusters").select("id").eq("suburb", suburb || "Footscray");
    if (existingClusters) {
      for (const c of existingClusters) {
        await sb.from("cluster_members").delete().eq("cluster_id", c.id);
      }
      await sb.from("clusters").delete().eq("suburb", suburb || "Footscray");
    }

    // Save to database
    const savedClusters = [];

    for (const cr of clusterResults) {
      const clusterId = uuidv4();
      const cluster = {
        id: clusterId,
        name: cr.name,
        suburb: suburb || "Footscray",
        resilience_score: cr.resilience_score,
        gaps: cr.gaps,
        explanation: cr.explanation,
        status: "peace" as const,
        created_at: new Date().toISOString(),
        members: cr.member_ids.map((mid) => {
          const p = profiles.find((pr) => pr.id === mid);
          return {
            id: uuidv4(),
            user_id: mid,
            cluster_id: clusterId,
            profile: p ? { ...p, suburb: suburb || "Footscray", postcode: postcode || "3011", approximate_location: "", household_size: 1, created_at: new Date().toISOString() } : null,
            capabilities: p?.capabilities.map((c, i) => ({ id: `cap-${mid}-${i}`, user_id: mid, ...c })) || [],
            needs: p?.needs.map((n, i) => ({ id: `need-${mid}-${i}`, user_id: mid, detail: "", ...n })) || [],
          };
        }).filter((m) => m.profile !== null),
      };

      await sb.from("clusters").insert({
        id: clusterId,
        name: cr.name,
        suburb: suburb || "Footscray",
        resilience_score: cr.resilience_score,
        gaps: JSON.stringify(cr.gaps),
        explanation: cr.explanation,
        status: "peace",
      });

      const memberRows = cr.member_ids.map((mid) => ({
        id: uuidv4(),
        cluster_id: clusterId,
        user_id: mid,
      }));
      await sb.from("cluster_members").insert(memberRows);

      savedClusters.push(cluster);
    }

    return NextResponse.json({ clusters: savedClusters });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate clusters";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Find user's cluster
    const { data: membership } = await sb
      .from("cluster_members").select("cluster_id").eq("user_id", userId).single();

    if (!membership) {
      return NextResponse.json({ error: "No cluster found for this user" }, { status: 404 });
    }

    const { data: cluster } = await sb
      .from("clusters").select("*").eq("id", membership.cluster_id).single();

    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
    }

    const { data: members } = await sb
      .from("cluster_members").select("*, profiles(id, name, email, suburb, postcode, lat, lng, approximate_location, household_size, languages, onboarding_complete, created_at)").eq("cluster_id", cluster.id);

    const { data: userProfile } = await sb.from("profiles").select("*").eq("id", userId).single();

    const enrichedMembers = [];
    for (const m of members || []) {
      const { data: caps } = await sb.from("capabilities").select("*").eq("user_id", m.user_id);
      const { data: nds } = await sb.from("needs").select("*").eq("user_id", m.user_id);
      const profile = (m as Record<string, unknown>).profiles as Record<string, unknown>;
      enrichedMembers.push({
        ...m,
        profile: profile || {},
        capabilities: caps || [],
        needs: nds || [],
        distance_meters: userProfile
          ? haversineDistance(userProfile.lat, userProfile.lng, (profile?.lat as number) || 0, (profile?.lng as number) || 0)
          : 0,
      });
    }

    return NextResponse.json({
      ...cluster,
      gaps: typeof cluster.gaps === "string" ? JSON.parse(cluster.gaps) : cluster.gaps,
      members: enrichedMembers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get cluster";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function createFallbackClusters(profiles: Array<{
  id: string; name: string; lat: number; lng: number;
  languages: string[];
  capabilities: { tag: string; category: string; detail: string }[];
  needs: { tag: string; category: string; priority: number }[];
}>) {
  // Simple proximity-based clustering
  const used = new Set<string>();
  const clusters: Array<{
    name: string; member_ids: string[]; resilience_score: number;
    matched_pairs: { need: string; offer: string; strength: string }[];
    gaps: string[]; explanation: string;
  }> = [];

  const clusterNames = [
    "The Barkly Street Five", "Maribyrnong Neighbours", "Droop Street Squad",
    "Irving Street Circle", "Paisley Park Crew", "Gordon Street Group",
    "Footscray Heart", "Nicholson Neighbours", "Station Side Crew", "West Side United",
  ];

  let nameIdx = 0;

  for (const anchor of profiles) {
    if (used.has(anchor.id)) continue;

    const nearby = profiles
      .filter((p) => !used.has(p.id) && p.id !== anchor.id)
      .map((p) => ({
        ...p,
        dist: haversineDistance(anchor.lat, anchor.lng, p.lat, p.lng),
      }))
      .filter((p) => p.dist < 600)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4);

    if (nearby.length < 2) continue;

    const members = [anchor, ...nearby];
    members.forEach((m) => used.add(m.id));

    const allCaps = new Set(members.flatMap((m) => m.capabilities.map((c) => c.category)));
    const allNeeds = members.flatMap((m) => m.needs);
    const unmatchedNeeds = allNeeds.filter((n) => !allCaps.has(n.category));
    const gaps = Array.from(new Set(unmatchedNeeds.map((n) => `No ${n.category} capability in cluster`)));
    const matched = allNeeds.filter((n) => allCaps.has(n.category));
    const score = Math.min(100, Math.round(
      (matched.length / Math.max(allNeeds.length, 1)) * 60 +
      (allCaps.size / 11) * 30 +
      (members.length >= 4 ? 10 : 5)
    ));

    clusters.push({
      name: clusterNames[nameIdx % clusterNames.length],
      member_ids: members.map((m) => m.id),
      resilience_score: score,
      matched_pairs: matched.slice(0, 3).map((n) => ({
        need: `Someone needs ${n.category}`,
        offer: `Cluster has ${n.category} capability`,
        strength: "strong",
      })),
      gaps,
      explanation: `This cluster of ${members.length} neighbours within 500m of each other covers ${allCaps.size} capability categories. ${gaps.length > 0 ? `Gaps: ${gaps.join(", ")}.` : "All major needs are covered."}`,
    });
    nameIdx++;
  }

  return clusters;
}
