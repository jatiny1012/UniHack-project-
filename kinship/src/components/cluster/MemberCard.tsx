import { getCategoryIcon, formatDistance } from "@/lib/utils";
import type { ClusterMember } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface MemberCardProps {
  member: ClusterMember;
  currentUserLocation?: { lat: number; lng: number };
  isCurrentUser?: boolean;
}

export function MemberCard({ member, currentUserLocation, isCurrentUser }: MemberCardProps) {
  const dist = member.distance_meters || 0;
  const priorityColors = { 1: "danger", 2: "accent", 3: "success" } as const;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 min-w-[220px] ${
      isCurrentUser ? "border-primary ring-2 ring-primary/20" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-textDark">
            {member.profile.name}
            {isCurrentUser && <span className="text-primary text-xs ml-1">(You)</span>}
          </h4>
          {dist > 0 && (
            <p className="text-sm text-textMuted">{formatDistance(dist)} away</p>
          )}
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
          {member.profile.name[0]}
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-1 mb-2">
        {member.profile.languages.map((lang, i) => (
          <span key={i} className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full">
            🗣️ {lang}
          </span>
        ))}
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1 mb-2">
        {member.capabilities.slice(0, 4).map((cap, i) => (
          <span key={i} className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
            {getCategoryIcon(cap.category)} {cap.tag.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      {/* Needs */}
      {member.needs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {member.needs.slice(0, 3).map((need, i) => (
            <Badge key={i} variant={priorityColors[need.priority as 1 | 2 | 3] || "muted"} className="text-xs">
              {need.tag.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
