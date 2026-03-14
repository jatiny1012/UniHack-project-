import Dexie, { type Table } from "dexie";
import type { UserProfile, Capability, Need, Cluster, ClusterMember, CheckIn } from "@/types";

export interface MyProfile {
  id: string; // always "current" — singleton row
  user_id: string;
  token: string;
  email: string;
  profile: UserProfile | null;
  onboarding_complete: boolean;
}

class KinshipDB extends Dexie {
  profiles!: Table<UserProfile>;
  capabilities!: Table<Capability>;
  needs!: Table<Need>;
  clusters!: Table<Cluster>;
  clusterMembers!: Table<ClusterMember>;
  checkIns!: Table<CheckIn>;
  myProfile!: Table<MyProfile>;

  constructor() {
    super("KinshipDB");
    this.version(2).stores({
      profiles: "id, name, suburb, lat, lng",
      capabilities: "id, user_id, category",
      needs: "id, user_id, category",
      clusters: "id, suburb, status",
      clusterMembers: "id, cluster_id, user_id",
      checkIns: "id, user_id, cluster_id, timestamp",
      myProfile: "id",
    });
  }
}

export const offlineDB = new KinshipDB();

/** Save auth data (JWT + user_id) to Dexie */
export async function saveAuthToOffline(data: {
  user_id: string;
  token: string;
  email: string;
  profile?: UserProfile | null;
  onboarding_complete?: boolean;
}) {
  try {
    await offlineDB.myProfile.put({
      id: "current",
      user_id: data.user_id,
      token: data.token,
      email: data.email,
      profile: data.profile || null,
      onboarding_complete: data.onboarding_complete || false,
    });
  } catch (e) {
    console.error("Failed to save auth to offline DB:", e);
  }
}

/** Load saved auth from Dexie */
export async function loadAuthFromOffline(): Promise<MyProfile | null> {
  try {
    const row = await offlineDB.myProfile.get("current");
    return row || null;
  } catch (e) {
    console.error("Failed to load auth from offline DB:", e);
    return null;
  }
}

/** Clear auth from Dexie (logout) */
export async function clearAuthFromOffline() {
  try {
    await offlineDB.myProfile.delete("current");
  } catch (e) {
    console.error("Failed to clear auth from offline DB:", e);
  }
}

export async function syncToOffline(data: {
  profile?: UserProfile;
  capabilities?: Capability[];
  needs?: Need[];
  cluster?: Cluster;
  members?: ClusterMember[];
}) {
  try {
    if (data.profile) await offlineDB.profiles.put(data.profile);
    if (data.capabilities) await offlineDB.capabilities.bulkPut(data.capabilities);
    if (data.needs) await offlineDB.needs.bulkPut(data.needs);
    if (data.cluster) await offlineDB.clusters.put(data.cluster);
    if (data.members) await offlineDB.clusterMembers.bulkPut(data.members);
  } catch (e) {
    console.error("Offline sync failed:", e);
  }
}
