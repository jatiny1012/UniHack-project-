"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface CrisisSimulationProps {
  onSimulate: (data: {
    crisisEvent: { id: string; title: string; description: string };
    mockCheckIns: Array<{ user_id: string; user_name: string; status: string; message: string; delay: number }>;
  }) => void;
  onEnd: () => void;
  isActive: boolean;
}

export function CrisisSimulation({ onSimulate, onEnd, isActive }: CrisisSimulationProps) {
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (type: "flood" | "bushfire") => {
    setLoading(true);
    try {
      const res = await fetch("/api/crisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, suburb: "Footscray" }),
      });
      const data = await res.json();
      onSimulate(data);
      toast.success(`${type === "flood" ? "🌊 Flood" : "🔥 Bushfire"} simulation started`);
    } catch {
      toast.error("Simulation failed");
    }
    setLoading(false);
  };

  if (isActive) {
    return (
      <div className="flex gap-2">
        <Button variant="danger" onClick={onEnd} className="flex-1">
          End Simulation
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        onClick={() => handleSimulate("flood")}
        loading={loading}
        className="flex-1"
      >
        🌊 Simulate Flood
      </Button>
      <Button
        variant="secondary"
        onClick={() => handleSimulate("bushfire")}
        loading={loading}
        className="flex-1"
      >
        🔥 Simulate Bushfire
      </Button>
    </div>
  );
}
