import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { authenticateRequest } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const suburb = searchParams.get("suburb") || "Footscray";

    if (!q) {
      return NextResponse.json([]);
    }

    const terms = q.split(/\s+/).filter(Boolean);
    const sb = createServerClient();
    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: dbProfiles } = await sb
      .from("profiles").select("id, name, lat, lng, languages, suburb").eq("suburb", suburb);

    const profiles: Array<{
      id: string; name: string; lat: number; lng: number;
      languages: string[]; suburb: string;
      capabilities: { tag: string; category: string; detail: string }[];
    }> = [];

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
