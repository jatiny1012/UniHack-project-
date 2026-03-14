"use client";

import { useEffect, useState } from "react";
import type { CheckIn } from "@/types";
import { Clock, Check, AlertCircle, HeartHandshake, LogOut } from "lucide-react";

interface ClusterStatusProps {
  members: Array<{ user_id: string; profile: { name: string } }>;
  checkIns: CheckIn[];
  simulation?: boolean;
  mockCheckIns?: Array<{ user_id: string; user_name?: string; status: string; message?: string; delay: number }>;
}

const statusConfig = {
  safe: { icon: Check, color: "text-success", bg: "bg-success/10", label: "Safe" },
  need_help: { icon: AlertCircle, color: "text-danger", bg: "bg-danger/10", label: "Needs Help" },
  helping_others: { icon: HeartHandshake, color: "text-primary-light", bg: "bg-primary-light/10", label: "Helping Others" },
  evacuated: { icon: LogOut, color: "text-accent", bg: "bg-accent/10", label: "Evacuated" },
};

export function ClusterStatus({ members, checkIns, simulation, mockCheckIns }: ClusterStatusProps) {
  const [visibleMockIdx, setVisibleMockIdx] = useState(0);

  useEffect(() => {
    if (!simulation || !mockCheckIns) return;
    const interval = setInterval(() => {
      setVisibleMockIdx((prev) => Math.min(prev + 1, mockCheckIns.length));
    }, 1500);
    return () => clearInterval(interval);
  }, [simulation, mockCheckIns]);

  // Merge real check-ins with simulation mock ones
  const displayCheckIns: Array<{
    userId: string; name: string; status: string; message?: string; time: string;
  }> = [];

  // Add real check-ins
  for (const ci of checkIns) {
    const member = members.find((m) => m.user_id === ci.user_id);
    displayCheckIns.push({
      userId: ci.user_id,
      name: member?.profile.name || "Unknown",
      status: ci.status,
      message: ci.message,
      time: new Date(ci.timestamp).toLocaleTimeString(),
    });
  }

  // Add visible mock check-ins
  if (simulation && mockCheckIns) {
    for (let i = 0; i < visibleMockIdx && i < mockCheckIns.length; i++) {
      const mc = mockCheckIns[i];
      if (!displayCheckIns.find((d) => d.userId === mc.user_id)) {
        displayCheckIns.push({
          userId: mc.user_id,
          name: mc.user_name || "Neighbour",
          status: mc.status,
          message: mc.message,
          time: "just now",
        });
      }
    }
  }

  // Add "hasn't checked in" for members without a check-in
  const checkedInIds = new Set(displayCheckIns.map((d) => d.userId));
  const notCheckedIn = members.filter((m) => !checkedInIds.has(m.user_id));

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-textDark mb-3">Cluster Status</h3>

      {displayCheckIns.map((ci, i) => {
        const config = statusConfig[ci.status as keyof typeof statusConfig] || statusConfig.safe;
        const Icon = config.icon;
        return (
          <div key={`${ci.userId}-${i}`} className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} animate-fade-slide-up`}>
            <Icon size={20} className={`${config.color} mt-0.5 shrink-0`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-textDark">
                {ci.name} — <span className={config.color}>{config.label}</span>
              </p>
              {ci.message && <p className="text-sm text-textMuted mt-0.5">{ci.message}</p>}
              <p className="text-xs text-textMuted mt-1">{ci.time}</p>
            </div>
          </div>
        );
      })}

      {notCheckedIn.map((m) => (
        <div key={m.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-accent/5">
          <Clock size={20} className="text-accent animate-pulse shrink-0" />
          <p className="text-sm font-semibold text-textDark">
            {m.profile.name} — <span className="text-accent">Hasn&apos;t checked in</span>
          </p>
        </div>
      ))}
    </div>
  );
}
