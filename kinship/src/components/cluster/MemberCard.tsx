import { getCategoryIcon, formatDistance } from "@/lib/utils";
import type { ClusterMember } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Phone, MessageCircle, Send } from "lucide-react";

interface MemberCardProps {
  member: ClusterMember;
  currentUserLocation?: { lat: number; lng: number };
  isCurrentUser?: boolean;
  isCrisis?: boolean;
}

export function MemberCard({ member, currentUserLocation, isCurrentUser, isCrisis }: MemberCardProps) {
  const dist = member.distance_meters || 0;
  const priorityColors = { 1: "danger", 2: "accent", 3: "success" } as const;

  const getContactBadge = (method?: "SMS" | "WhatsApp" | "Call" | "App") => {
    switch (method) {
      case "SMS":
        return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"><MessageSquare size={10} /> SMS</span>;
      case "WhatsApp":
        return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"><MessageCircle size={10} /> WhatsApp</span>;
      case "Call":
        return <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"><Phone size={10} /> Call</span>;
      case "App":
      default:
        return <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"><Send size={10} /> App Notification</span>;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 min-w-[260px] flex flex-col ${
      isCurrentUser ? "border-primary ring-2 ring-primary/20" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-textDark">
              {member.profile.name}
              {isCurrentUser && <span className="text-primary text-xs ml-1">(You)</span>}
            </h4>
            {member.profile.preferred_contact_method && getContactBadge(member.profile.preferred_contact_method)}
          </div>
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
          <span key={i} className="text-xs bg-gray-100 text-textDark px-2 py-0.5 rounded-full">
            🗣️ {lang}
          </span>
        ))}
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1 mb-2">
        {member.capabilities.slice(0, 4).map((cap, i) => (
          <span key={i} className="text-xs bg-accent/10 text-accent font-medium px-2 py-0.5 rounded-full">
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

      {/* Contact Details Grid */}
      {isCrisis && (
        <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-3">
          {member.profile.phone && (
            <div>
              <span className="text-textMuted block text-[10px] uppercase font-semibold">Mobile</span>
              <span className="text-textDark font-medium font-mono">{member.profile.phone}</span>
            </div>
          )}
          {member.profile.whatsapp && member.profile.whatsapp !== member.profile.phone && (
            <div>
              <span className="text-textMuted block text-[10px] uppercase font-semibold">WhatsApp</span>
              <span className="text-textDark font-medium font-mono">{member.profile.whatsapp}</span>
            </div>
          )}
          {member.profile.telegram_username && (
            <div className="col-span-2">
              <span className="text-textMuted block text-[10px] uppercase font-semibold">Telegram</span>
              <span className="text-textDark font-medium">@{member.profile.telegram_username.replace("@", "")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
