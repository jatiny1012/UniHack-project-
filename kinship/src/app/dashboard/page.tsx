"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useKinshipStore } from "@/lib/store";
import { useConnectivity } from "@/lib/ConnectivityContext";
import { syncToOffline, offlineDB } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { ClusterDashboard } from "@/components/cluster/ClusterDashboard";
import { CrisisSimulation } from "@/components/crisis/CrisisSimulation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Droplets, Flame, Users } from "lucide-react";
import type { Cluster } from "@/types";
import toast from "react-hot-toast";

const NeighbourhoodMap = dynamic(() => import("@/components/map/NeighbourhoodMap"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />,
});

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, token, cluster, setCluster, setCrisisActive, setSimulation, isSimulation, isCrisisActive } = useKinshipStore();
  const [showFlood, setShowFlood] = useState(false);
  const [showBushfire, setShowBushfire] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCrisis, setIsCrisis] = useState(false);

  const { mode } = useConnectivity();

  useEffect(() => {
    if (!token || !currentUser) {
      router.push("/onboard");
      return;
    }

    const loadCluster = async () => {
      try {
        if (mode === "offline" || mode === "p2p") {
          // Load from Dexie cache
          const membership = await offlineDB.clusterMembers
            .where("user_id").equals(currentUser.id).first();
          if (membership) {
            const cachedCluster = await offlineDB.clusters.get(membership.cluster_id);
            if (cachedCluster) {
              const cachedMembers = await offlineDB.clusterMembers
                .where("cluster_id").equals(cachedCluster.id).toArray();
              // Enrich members with their profiles, capabilities, needs
              const enrichedMembers = await Promise.all(
                cachedMembers.map(async (m) => {
                  const profile = await offlineDB.profiles.get(m.user_id);
                  const caps = await offlineDB.capabilities
                    .where("user_id").equals(m.user_id).toArray();
                  const nds = await offlineDB.needs
                    .where("user_id").equals(m.user_id).toArray();
                  return { ...m, profile: (profile || {}) as any, capabilities: caps, needs: nds };
                })
              );
              setCluster({ ...cachedCluster, members: enrichedMembers });
            }
          }
        } else {
          // Online — fetch from API and cache result
          const res = await fetch(`/api/clusters?user_id=${currentUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data && !data.error) {
            setCluster(data);
            await syncToOffline({
              cluster: data,
              members: data.members || [],
            });
            // Also cache each member's profile, capabilities and needs individually
            for (const m of data.members || []) {
              if (m.profile) await offlineDB.profiles.put(m.profile);
              if (m.capabilities?.length) await offlineDB.capabilities.bulkPut(m.capabilities);
              if (m.needs?.length) await offlineDB.needs.bulkPut(m.needs);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load cluster:", error);
      }
      setLoading(false);
    };

    loadCluster();
  }, [currentUser, token, setCluster, router, mode]);

  const handleSimulate = (data: {
    crisisEvent: { id: string; title: string };
    mockCheckIns: Array<{ user_id: string; user_name: string; status: string; message: string; delay: number }>;
  }) => {
    setShowFlood(true);
    setIsCrisis(true);
    setCrisisActive(true);
    setSimulation(true);
    toast("🚨 Crisis simulation started!", { icon: "⚠️" });
    setTimeout(() => {
      router.push("/crisis");
    }, 2000);
  };

  const handleEndSimulation = () => {
    setShowFlood(false);
    setIsCrisis(false);
    setCrisisActive(false);
    setSimulation(false);
  };

  if (!token || !currentUser) return null;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-5xl mx-auto p-4 space-y-4">
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {/* Map */}
        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="relative h-[50vh] min-h-[400px]">
            <NeighbourhoodMap
              cluster={cluster}
              currentUserId={currentUser.id}
              showFloodZones={showFlood}
              showBushfire={showBushfire}
              isCrisis={isCrisis}
            />
            {/* Map overlay buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-[1000]">
              <button
                onClick={() => setShowFlood(!showFlood)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
                  showFlood ? "bg-primary-light text-white" : "bg-white text-textDark hover:bg-gray-50"
                }`}
              >
                <Droplets size={14} className="inline mr-1" />
                Flood Zones
              </button>
              <button
                onClick={() => setShowBushfire(!showBushfire)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
                  showBushfire ? "bg-danger text-white" : "bg-white text-textDark hover:bg-gray-50"
                }`}
              >
                <Flame size={14} className="inline mr-1" />
                Bushfire Risk
              </button>
            </div>
          </div>
        </Card>

        {/* Cluster Detail */}
        {cluster && (
          <ClusterDashboard
            cluster={cluster}
            currentUserId={currentUser.id}
            isCrisis={isCrisisActive || isSimulation}
          />
        )}

        {!cluster && (
          <Card className="text-center py-12 px-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-textDark mb-2">No Cluster Assigned</h3>
            <p className="text-textMuted max-w-md">
              We are waiting for more neighbours to join your area. A Kinship cluster will automatically be formed once enough people in your suburb are online.
            </p>
          </Card>
        )}

        {/* Action Bar */}
        <div className="flex gap-3 pb-6">
          <Button
            variant="danger"
            onClick={() => { setCrisisActive(true); router.push("/crisis"); }}
            className="flex-1"
          >
            <AlertTriangle size={18} />
            Enter Crisis Mode
          </Button>
          <CrisisSimulation
            onSimulate={handleSimulate}
            onEnd={handleEndSimulation}
            isActive={isSimulation}
          />
        </div>
      </main>
    </>
  );
}
