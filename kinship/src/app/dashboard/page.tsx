"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useKinshipStore } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { ClusterDashboard } from "@/components/cluster/ClusterDashboard";
import { CrisisSimulation } from "@/components/crisis/CrisisSimulation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Droplets, Flame } from "lucide-react";
import type { Cluster } from "@/types";
import toast from "react-hot-toast";

const NeighbourhoodMap = dynamic(() => import("@/components/map/NeighbourhoodMap"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />,
});

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, token, cluster, setCluster, setCrisisActive, setSimulation, isSimulation } = useKinshipStore();
  const [showFlood, setShowFlood] = useState(false);
  const [showBushfire, setShowBushfire] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCrisis, setIsCrisis] = useState(false);

  useEffect(() => {
    if (!token || !currentUser) {
      router.push("/onboard");
      return;
    }

    const loadCluster = async () => {
      try {
        const res = await fetch(`/api/clusters?user_id=${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && !data.error) {
          setCluster(data);
        }
      } catch (error) {
        console.error("Failed to load cluster:", error);
      }
      setLoading(false);
    };

    loadCluster();
  }, [currentUser, token, setCluster, router]);

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
        <Card className="p-0 overflow-hidden">
          <div className="relative" style={{ height: "45vh", minHeight: "300px" }}>
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
          />
        )}

        {!cluster && (
          <Card className="text-center p-8">
            <p className="text-textMuted">No cluster assigned yet. More neighbours need to join your area first.</p>
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
