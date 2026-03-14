import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { PARSE_SYSTEM_PROMPT } from "@/lib/matching";
import { v4 as uuidv4 } from "uuid";

const CHECKBOX_MAP: Record<string, { tag: string; category: string; detail: string }> = {
  vehicle: { tag: "has_vehicle", category: "transport", detail: "Has a vehicle" },
  first_aid: { tag: "first_aid_trained", category: "medical", detail: "First aid training" },
  generator: { tag: "has_generator", category: "power", detail: "Generator / solar / battery" },
  spare_room: { tag: "spare_room", category: "shelter", detail: "Spare room available" },
  translation: { tag: "translator", category: "language", detail: "Can translate languages" },
  cooking: { tag: "can_cook_bulk", category: "food", detail: "Can cook for groups" },
  it_skills: { tag: "IT_skills", category: "communication", detail: "IT / tech skills" },
  tools: { tag: "has_tools", category: "equipment", detail: "Tools and equipment" },
  pet_care: { tag: "can_mind_pets", category: "care", detail: "Can mind pets" },
  childcare: { tag: "childcare_experience", category: "childcare", detail: "Childcare experience" },
  radio: { tag: "has_radio", category: "communication", detail: "Radio / communications equipment" },
  physical: { tag: "physical_labour", category: "physical_help", detail: "Can do physical labour" },
};

const NEEDS_CHECKBOX_MAP: Record<string, { tag: string; category: string; detail: string; priority: number }> = {
  transport: { tag: "needs_transport", category: "transport", detail: "Needs transport / evacuation", priority: 2 },
  medical: { tag: "needs_medical", category: "medical", detail: "Needs medical support", priority: 2 },
  language: { tag: "needs_language_help", category: "language", detail: "Needs language help", priority: 2 },
  shelter: { tag: "needs_shelter", category: "shelter", detail: "Needs shelter", priority: 2 },
  power: { tag: "needs_power", category: "power", detail: "Needs power for devices", priority: 2 },
  communication: { tag: "needs_communication", category: "communication", detail: "Needs communication help", priority: 2 },
  pet_care: { tag: "needs_pet_care", category: "care", detail: "Needs pet care during evacuation", priority: 3 },
  mobility: { tag: "mobility_impaired", category: "physical_help", detail: "Needs mobility assistance", priority: 1 },
  childcare: { tag: "needs_childcare", category: "childcare", detail: "Needs childcare", priority: 2 },
  elderly: { tag: "elderly_needs_checkins", category: "care", detail: "Needs elderly check-ins", priority: 2 },
  vision_hearing: { tag: "vision_hearing_support", category: "communication", detail: "Vision / hearing support", priority: 2 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      raw_capabilities_text,
      raw_needs_text,
      checkbox_capabilities,
      checkbox_needs,
    } = body;

    let parsedCapabilities: { tag: string; category: string; detail: string }[] = [];
    let parsedNeeds: { tag: string; category: string; detail: string; priority: number }[] = [];
    let parsedLanguages: string[] = [];

    // Parse free text via Claude if there's content
    if (raw_capabilities_text || raw_needs_text) {
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
              max_tokens: 1024,
              system: PARSE_SYSTEM_PROMPT,
              messages: [
                {
                  role: "user",
                  content: `Capabilities: ${raw_capabilities_text || "none"}\nNeeds: ${raw_needs_text || "none"}\nExtract all tags.`,
                },
              ],
            }),
          });

          const data = await response.json();
          const text = data.content?.[0]?.text || "{}";
          const parsed = JSON.parse(text);
          parsedCapabilities = parsed.capabilities || [];
          parsedNeeds = parsed.needs || [];
          parsedLanguages = parsed.languages || [];
        } catch (e) {
          console.error("Claude parse failed:", e);
        }
      }
    }

    // Merge checkbox selections
    if (checkbox_capabilities && Array.isArray(checkbox_capabilities)) {
      for (const key of checkbox_capabilities) {
        const mapped = CHECKBOX_MAP[key];
        if (mapped && !parsedCapabilities.find((c) => c.tag === mapped.tag)) {
          parsedCapabilities.push(mapped);
        }
      }
    }
    if (checkbox_needs && Array.isArray(checkbox_needs)) {
      for (const key of checkbox_needs) {
        const mapped = NEEDS_CHECKBOX_MAP[key];
        if (mapped && !parsedNeeds.find((n) => n.tag === mapped.tag)) {
          parsedNeeds.push(mapped);
        }
      }
    }

    // Insert into database
    const sb = createServerClient();
    if (sb) {
      // Insert capabilities
      if (parsedCapabilities.length > 0) {
        const capRows = parsedCapabilities.map((c) => ({
          id: uuidv4(),
          user_id,
          tag: c.tag,
          category: c.category,
          detail: c.detail,
        }));
        await sb.from("capabilities").insert(capRows);
      }

      // Insert needs
      if (parsedNeeds.length > 0) {
        const needRows = parsedNeeds.map((n) => ({
          id: uuidv4(),
          user_id,
          tag: n.tag,
          category: n.category,
          detail: n.detail || "",
          priority: n.priority || 2,
        }));
        await sb.from("needs").insert(needRows);
      }

      // Update raw text on profile
      await sb.from("profiles").update({
        raw_capabilities_text,
        raw_needs_text,
      }).eq("id", user_id);
    }

    return NextResponse.json({
      capabilities: parsedCapabilities.map((c, i) => ({ id: `cap-${user_id}-${i}`, user_id, ...c })),
      needs: parsedNeeds.map((n, i) => ({ id: `need-${user_id}-${i}`, user_id, ...n, detail: n.detail || "" })),
      languages: parsedLanguages,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to parse text";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
