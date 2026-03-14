// Matching algorithm — wraps Claude API call for cluster generation
// This is called from the clusters API route (server-side only)

export interface MatchingInput {
  id: string;
  name: string;
  lat: number;
  lng: number;
  languages: string[];
  capabilities: { tag: string; category: string; detail: string }[];
  needs: { tag: string; category: string; priority: number }[];
}

export interface ClusterResult {
  name: string;
  member_ids: string[];
  resilience_score: number;
  matched_pairs: { need: string; offer: string; strength: string }[];
  gaps: string[];
  explanation: string;
}

export const CLUSTERING_SYSTEM_PROMPT = `You are the Kinship resilience cluster matching engine.

Given a list of residents with their locations, capabilities, needs, and languages, create optimal emergency resilience clusters.

RULES:
- Cluster size: 4-6 people per cluster
- Proximity: members should be within 500m of each other (use lat/lng)
- Every NEED should ideally be matched by a CAPABILITY in the same cluster
- Language matching: if someone speaks limited English, at least one other member should share their language
- Diversity: clusters should have varied capabilities (not all people with cars in one group)
- If a need cannot be matched, flag it as a GAP

RESPOND WITH ONLY VALID JSON (no backticks, no markdown):
{
  "clusters": [
    {
      "name": "A friendly 2-3 word name for this cluster",
      "member_ids": ["uuid1", "uuid2"],
      "resilience_score": 0-100,
      "matched_pairs": [
        {"need": "Person X needs transport", "offer": "Person Y has a car", "strength": "strong"}
      ],
      "gaps": ["No one has a generator", "No medical training"],
      "explanation": "2-3 sentence human-readable explanation of why these people complement each other. Reference specific members by name."
    }
  ]
}`;

export const PARSE_SYSTEM_PROMPT = `You extract structured emergency-preparedness tags from text.
Return ONLY valid JSON. No markdown. No explanation. No backticks.

Schema: {
  "capabilities": [{"tag": "string", "category": "string", "detail": "string"}],
  "needs": [{"tag": "string", "category": "string", "priority": 1|2|3}],
  "languages": ["string"]
}

Categories: transport, medical, shelter, power, communication, food, physical_help, childcare, language, equipment, care
Priority: 1=critical, 2=important, 3=nice-to-have`;
