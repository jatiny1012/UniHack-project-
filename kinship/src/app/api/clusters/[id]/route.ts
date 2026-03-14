import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clusterId = params.id;
    const sb = createServerClient();

    if (sb) {
      const { data: cluster, error } = await sb
        .from("clusters").select("*").eq("id", clusterId).single();

      if (error) throw error;

      const { data: members } = await sb
        .from("cluster_members").select("*, profiles(*)").eq("cluster_id", clusterId);

      return NextResponse.json({
        ...cluster,
        gaps: typeof cluster.gaps === "string" ? JSON.parse(cluster.gaps) : cluster.gaps,
        members: members || [],
      });
    }

    return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get cluster";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
