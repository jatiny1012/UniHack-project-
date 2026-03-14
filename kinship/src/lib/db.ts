import Dexie, { type Table } from "dexie";
import type { UserProfile, Capability, Need, Cluster, ClusterMember, CheckIn } from "@/types";

class KinshipDB extends Dexie {
  profiles!: Table<UserProfile>;
  capabilities!: Table<Capability>;
  needs!: Table<Need>;
  clusters!: Table<Cluster>;
  clusterMembers!: Table<ClusterMember>;
  checkIns!: Table<CheckIn>;

  constructor() {
    super("KinshipDB");
    this.version(1).stores({
      profiles: "id, name, suburb, lat, lng",
      capabilities: "id, user_id, category",
      needs: "id, user_id, category",
      clusters: "id, suburb, status",
      clusterMembers: "id, cluster_id, user_id",
      checkIns: "id, user_id, cluster_id, timestamp",
    });
  }
}

export const offlineDB = new KinshipDB();

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
