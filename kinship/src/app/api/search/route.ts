import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { SEED_PROFILES } from "@/data/seed-profiles";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const suburb = searchParams.get("suburb") || "Footscray";

    if (!q) {
      return NextResponse.json([]);
    }

    const terms = q.split(/\s+/).filter(Boolean);
    const sb = createServerClient();

    let profiles: Array<{
      id: string; name: string; lat: number; lng: number;
      languages: string[]; suburb: string;
      capabilities: { tag: string; category: string; detail: string }[];
    }> = [];

    if (sb) {
      const { data: dbProfiles } = await sb
        .from("profiles").select("*").eq("suburb", suburb);

      if (dbProfiles && dbProfiles.length > 0) {
        for (const p of dbProfiles) {
          const { data: caps } = await sb.from("capabilities").select("*").eq("user_id", p.id);
          profiles.push({
            id: p.id, name: p.name, lat: p.lat, lng: p.lng,
            languages: p.languages || ["English"], suburb: p.suburb,
            capabilities: (caps || []).map((c: Record<string, string>) => ({ tag: c.tag, category: c.category, detail: c.detail || "" })),
          });
        }
      }
    }

    // Fallback to seed data
    if (profiles.length === 0) {
      profiles = SEED_PROFILES.map((p) => ({
        id: p.id, name: p.name, lat: p.lat, lng: p.lng,
        languages: p.languages, suburb: p.suburb,
        capabilities: p.capabilities,
      }));
    }

    // Fuzzy search: match query terms against all searchable fields
    const results = profiles.map((p) => {
      const searchable = [
        p.name.toLowerCase(),
        ...p.languages.map((l) => l.toLowerCase()),
        ...(p.capabilities || []).flatMap((c) => [
          c.tag.toLowerCase(),
          c.category.toLowerCase(),
          (c.detail || "").toLowerCase(),
        ]),
      ].join(" ");

      const matchCount = terms.filter((t) => searchable.includes(t)).length;
      const partialMatchCount = terms.filter((t) => searchable.indexOf(t) !== -1).length;

      return {
        ...p,
        relevance: matchCount * 2 + partialMatchCount,
      };
    }).filter((p) => p.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);

    return NextResponse.json(results);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
