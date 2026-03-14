export interface UserProfile {
  id: string;
  email: string;
  name: string;
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
  approximate_location: string;
  household_size: number;
  languages: string[];
  onboarding_complete: boolean;
  created_at: string;
}

export interface Capability {
  id: string;
  user_id: string;
  tag: string;
  category: CapabilityCategory;
  detail: string;
}

export interface Need {
  id: string;
  user_id: string;
  tag: string;
  category: CapabilityCategory;
  detail: string;
  priority: 1 | 2 | 3;
}

export type CapabilityCategory =
  | "transport" | "medical" | "shelter" | "power"
  | "communication" | "food" | "physical_help"
  | "childcare" | "language" | "equipment" | "care";

export interface Cluster {
  id: string;
  name: string;
  suburb: string;
  resilience_score: number;
  gaps: string[];
  explanation: string;
  status: "peace" | "alert" | "crisis";
  members: ClusterMember[];
  created_at: string;
}

export interface ClusterMember {
  id: string;
  user_id: string;
  cluster_id: string;
  profile: UserProfile;
  capabilities: Capability[];
  needs: Need[];
  distance_meters?: number;
}

export interface CheckIn {
  id: string;
  user_id: string;
  cluster_id: string;
  crisis_event_id?: string;
  status: "safe" | "need_help" | "helping_others" | "evacuated";
  message?: string;
  lat?: number;
  lng?: number;
  timestamp: string;
}

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  severity: "watch" | "warning" | "emergency";
  affected_postcodes: string[];
  status: "active" | "resolved";
  created_at: string;
}

export interface ParsedTags {
  capabilities: { tag: string; category: CapabilityCategory; detail: string }[];
  needs: { tag: string; category: CapabilityCategory; priority: 1 | 2 | 3 }[];
  languages: string[];
}

export interface P2PMessage {
  type: "checkin" | "gps" | "text" | "resource_request";
  user_id: string;
  user_name: string;
  payload: string;
  timestamp: string;
}

export type ConnectivityMode = "online" | "offline" | "p2p";
