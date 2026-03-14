"use client";

import type { Cluster } from "@/types";
import { ResilienceGauge } from "./ResilienceGauge";
import { MemberCard } from "./MemberCard";
import { GapAnalysis } from "./GapAnalysis";
import { Card } from "@/components/ui/Card";
import { MessageSquareQuote } from "lucide-react";

interface ClusterDashboardProps {
  cluster: Cluster;
  currentUserId: string | null;
  isCrisis?: boolean;
}

export function ClusterDashboard({ cluster, currentUserId, isCrisis }: ClusterDashboardProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-textDark">{cluster.name}</h2>
        <p className="text-sm text-textMuted">{cluster.members.length} neighbours • {cluster.suburb}</p>
      </div>

      {/* Resilience Score + Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex items-center justify-center py-6">
          <ResilienceGauge score={cluster.resilience_score} />
        </Card>
        <Card>
          <h3 className="font-semibold text-textDark mb-3">Gap Analysis</h3>
          <GapAnalysis gaps={cluster.gaps} />
        </Card>
      </div>

      {/* AI Explanation */}
      {cluster.explanation && (
        <Card className="bg-primary/[0.02] border-primary/10">
          <div className="flex items-start gap-3">
            <MessageSquareQuote size={20} className="text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-primary mb-1">Why you&apos;re matched</h3>
              <p className="text-sm text-textDark leading-relaxed">{cluster.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Member Cards */}
      <div>
        <h3 className="font-semibold text-textDark mb-3">Your Cluster Members</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible">
          {cluster.members.map((m) => (
            <MemberCard
              key={m.user_id}
              member={m}
              isCurrentUser={m.user_id === currentUserId}
              isCrisis={isCrisis}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
