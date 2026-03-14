"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKinshipStore } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { CheckInButtons } from "@/components/crisis/CheckInButtons";
import { ClusterStatus } from "@/components/crisis/ClusterStatus";
import { P2PConnect } from "@/components/crisis/P2PConnect";
import { MessageFeed } from "@/components/crisis/MessageFeed";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Phone, AlertTriangle } from "lucide-react";

export default function CrisisPage() {
  const router = useRouter();
  const {
    currentUser, token, cluster, isCrisisActive, isSimulation,
    setCrisisActive, setSimulation, checkIns, addCheckIn,
  } = useKinshipStore();
  const [mockCheckIns, setMockCheckIns] = useState<Array<{
    user_id: string; user_name: string; status: string; message: string; delay: number;
  }>>([]);

  useEffect(() => {
    if (!token || !currentUser) {
      router.push("/onboard");
      return;
    }
  }, [token, currentUser, router]);

  const userId = currentUser?.id || "";
  const userName = currentUser?.name || "";

  useEffect(() => {
    if (isSimulation && mockCheckIns.length === 0 && cluster?.members) {
      // Generate mock check-ins from actual cluster members
      const statuses = ["safe", "need_help", "safe", "helping_others", "safe"];
      const messages = [
        "All good here, doors locked up",
        "Water rising near my street, can't get out",
        "",
        "Checking on elderly neighbours",
        "Everyone safe here",
      ];
      setMockCheckIns(
        cluster.members.slice(0, 5).map((m, i) => ({
          user_id: m.user_id,
          user_name: m.profile?.name || `Member ${i + 1}`,
          status: statuses[i % statuses.length],
          message: messages[i % messages.length],
          delay: i * 1500,
        }))
      );
    }
  }, [isSimulation, mockCheckIns.length, cluster]);

  const handleEndCrisis = () => {
    setCrisisActive(false);
    setSimulation(false);
    setMockCheckIns([]);
    router.push("/dashboard");
  };

  if (!token || !currentUser) return null;

  const members = cluster?.members || [];

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto pb-28">
        {/* Crisis Header */}
        <div className={`p-4 ${isCrisisActive || isSimulation ? "bg-danger text-white crisis-glow" : "bg-primary text-white"}`}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={20} />
            <h1 className="text-lg font-bold">
              {isCrisisActive ? "🚨 CRISIS ACTIVE" : "Crisis Mode"}
            </h1>
            {isSimulation && (
              <Badge variant="accent" className="text-xs ml-auto">SIMULATION</Badge>
            )}
          </div>
          <p className="text-sm opacity-90">
            {isSimulation
              ? "Severe Flood Warning — Footscray"
              : isCrisisActive
                ? "Emergency alert active in your area"
                : "No active crisis. You can run a simulation."
            }
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Check-In Buttons */}
          <Card>
            <CheckInButtons
              userId={userId}
              clusterId={cluster?.id || "simulation"}
              crisisEventId={isSimulation ? "simulation" : undefined}
              onCheckIn={(status, message) => {
                addCheckIn({
                  id: `checkin-${Date.now()}`,
                  user_id: userId,
                  cluster_id: cluster?.id || "simulation",
                  status: status as "safe" | "need_help" | "helping_others" | "evacuated",
                  message,
                  timestamp: new Date().toISOString(),
                });
              }}
            />
          </Card>

          {/* Cluster Status */}
          <Card>
            <ClusterStatus
              members={members}
              checkIns={checkIns}
              simulation={isSimulation}
              mockCheckIns={mockCheckIns}
            />
          </Card>

          {/* P2P Connection */}
          <Card>
            <P2PConnect
              userId={userId}
              clusterName={cluster?.name || "Kinship Cluster"}
            />
          </Card>

          {/* Message Feed */}
          <Card>
            <MessageFeed simulation={isSimulation} />
          </Card>
        </div>

        {/* Bottom Emergency Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
          <div className="max-w-2xl mx-auto flex gap-2">
            <a
              href="tel:000"
              className="flex-1 bg-danger text-white rounded-xl px-4 py-3 font-bold text-center flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              Call 000
            </a>
            <a
              href="tel:132500"
              className="flex-1 bg-accent text-white rounded-xl px-4 py-3 font-bold text-center flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              SES 132 500
            </a>
            <Button variant="secondary" onClick={handleEndCrisis} className="shrink-0">
              {isSimulation ? "End Sim" : "End Crisis"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
