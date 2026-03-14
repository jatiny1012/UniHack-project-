"use client";

import { useRouter } from "next/navigation";
import { useKinshipStore } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCategoryIcon } from "@/lib/utils";
import { ArrowLeft, MapPin, Users, Shield, Trash2, LogOut } from "lucide-react";
import { SEED_PROFILES } from "@/data/seed-profiles";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, capabilities, needs, cluster, connectivity } = useKinshipStore();

  const user = currentUser || {
    id: SEED_PROFILES[1].id,
    name: SEED_PROFILES[1].name,
    suburb: "Footscray",
    postcode: "3011",
    approximate_location: SEED_PROFILES[1].approximate_location,
    household_size: SEED_PROFILES[1].household_size,
    languages: SEED_PROFILES[1].languages,
    lat: SEED_PROFILES[1].lat,
    lng: SEED_PROFILES[1].lng,
    created_at: new Date().toISOString(),
  };

  const userCaps = capabilities.length > 0
    ? capabilities
    : SEED_PROFILES[1].capabilities.map((c, i) => ({ id: `cap-${i}`, user_id: user.id, ...c }));

  const userNeeds = needs.length > 0
    ? needs
    : SEED_PROFILES[1].needs.map((n, i) => ({ id: `need-${i}`, user_id: user.id, detail: "", ...n }));

  const priorityVariant = { 1: "danger", 2: "accent", 3: "success" } as const;

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto p-4 space-y-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Profile Header */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-textDark">{user.name}</h2>
              <p className="text-sm text-textMuted flex items-center gap-1">
                <MapPin size={14} />
                {user.suburb} {user.postcode}
                {user.approximate_location && ` • ${user.approximate_location}`}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.languages.map((lang, i) => (
                  <Badge key={i} variant="info" className="text-xs">🗣️ {lang}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-textMuted">
            <Users size={14} className="inline mr-1" />
            Household size: {user.household_size}
          </div>
        </Card>

        {/* Capabilities */}
        <Card>
          <h3 className="font-semibold text-textDark mb-3">What I Can Offer</h3>
          <div className="flex flex-wrap gap-2">
            {userCaps.map((cap, i) => (
              <Badge key={i} variant="success">
                {getCategoryIcon(cap.category)} {cap.tag.replace(/_/g, " ")}
              </Badge>
            ))}
            {userCaps.length === 0 && (
              <p className="text-sm text-textMuted">No capabilities set yet</p>
            )}
          </div>
        </Card>

        {/* Needs */}
        <Card>
          <h3 className="font-semibold text-textDark mb-3">What I Might Need</h3>
          <div className="flex flex-wrap gap-2">
            {userNeeds.map((need, i) => (
              <Badge key={i} variant={priorityVariant[need.priority as 1 | 2 | 3] || "muted"}>
                {need.tag.replace(/_/g, " ")}
                {need.priority === 1 && " (critical)"}
                {need.priority === 2 && " (important)"}
              </Badge>
            ))}
            {userNeeds.length === 0 && (
              <p className="text-sm text-textMuted">No needs specified</p>
            )}
          </div>
        </Card>

        {/* Cluster Info */}
        {cluster && (
          <Card>
            <h3 className="font-semibold text-textDark mb-2 flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Your Cluster
            </h3>
            <p className="text-sm text-textDark font-medium">{cluster.name}</p>
            <p className="text-sm text-textMuted">
              Resilience score: <span className="font-semibold text-success">{cluster.resilience_score}</span> / 100
            </p>
            <p className="text-sm text-textMuted">
              {cluster.members.length} members
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="mt-2"
            >
              View on Dashboard
            </Button>
          </Card>
        )}

        {/* Privacy */}
        <Card>
          <h3 className="font-semibold text-textDark mb-3">Privacy & Security</h3>
          <div className="space-y-2 text-sm text-textMuted">
            <p>🔒 Your location is approximate (±50m)</p>
            <p>👥 Visible to: your cluster only ({cluster?.members.length || 5} people)</p>
            <p>📡 Connectivity: {connectivity === "online" ? "🟢 Online" : connectivity === "offline" ? "🟡 Offline" : "🔵 P2P"}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" size="sm" className="text-textMuted">
              <LogOut size={14} /> Leave Cluster
            </Button>
            <Button variant="ghost" size="sm" className="text-danger">
              <Trash2 size={14} /> Delete My Data
            </Button>
          </div>
        </Card>
      </main>
    </>
  );
}
