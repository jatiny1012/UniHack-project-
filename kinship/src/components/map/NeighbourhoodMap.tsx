"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { FLOOD_ZONE_GEOJSON } from "@/data/flood-zones";
import { formatDistance, haversineDistance, getCategoryIcon } from "@/lib/utils";
import type { Cluster } from "@/types";

const CLUSTER_COLORS = [
  "#1B4F72", "#E74C3C", "#27AE60", "#F39C12",
  "#8E44AD", "#2E86C1", "#D35400", "#16A085",
];

function createMarkerIcon(color: string, isCurrentUser: boolean = false, isCrisis: boolean = false) {
  const size = isCurrentUser ? 20 : 12;
  const pulseClass = isCurrentUser ? "animate-pulse-marker" : "";
  const crisisClass = isCrisis ? "crisis-pulse" : "";
  return L.divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    " class="${pulseClass} ${crisisClass}"></div>`,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Helper component to dynamically recenter the map when cluster data changes
function MapCenterUpdater({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: true });
  }, [map, lat, lng, zoom]);
  return null;
}

interface NeighbourhoodMapProps {
  cluster: Cluster | null;
  currentUserId: string | null;
  showFloodZones?: boolean;
  showBushfire?: boolean;
  isCrisis?: boolean;
}

export default function NeighbourhoodMap({
  cluster,
  currentUserId,
  showFloodZones = false,
  showBushfire = false,
  isCrisis = false,
}: NeighbourhoodMapProps) {
  // Dynamically compute the map center from cluster data or current user
  const mapCenter = useMemo(() => {
    const members = cluster?.members || [];
    // Try to center on current user first
    const currentMember = members.find((m) => m.user_id === currentUserId);
    if (currentMember) {
      return { lat: currentMember.profile.lat, lng: currentMember.profile.lng };
    }
    // Otherwise center on mean of all members
    if (members.length > 0) {
      const avgLat = members.reduce((sum, m) => sum + m.profile.lat, 0) / members.length;
      const avgLng = members.reduce((sum, m) => sum + m.profile.lng, 0) / members.length;
      return { lat: avgLat, lng: avgLng };
    }
    // Final fallback to Footscray
    return { lat: -37.7996, lng: 144.8994 };
  }, [cluster, currentUserId]);

  // Get cluster member positions for lines
  const members = cluster?.members || [];
  const memberPositions: [number, number][] = members.map((m) => [m.profile.lat, m.profile.lng]);

  // Build connection lines between all cluster members
  const connectionLines: Array<[[number, number], [number, number]]> = [];
  for (let i = 0; i < memberPositions.length; i++) {
    for (let j = i + 1; j < memberPositions.length; j++) {
      connectionLines.push([memberPositions[i], memberPositions[j]]);
    }
  }



  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={15}
      className="h-full w-full rounded-xl"
      zoomControl={true}
      style={{ minHeight: "300px" }}
    >
      {/* Dynamic re-centering when cluster changes */}
      <MapCenterUpdater lat={mapCenter.lat} lng={mapCenter.lng} zoom={15} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Flood zone overlay */}
      {showFloodZones && (
        <GeoJSON
          data={FLOOD_ZONE_GEOJSON as GeoJSON.FeatureCollection}
          style={() => ({
            fillColor: "#2E86C1",
            fillOpacity: 0.3,
            color: "#1B4F72",
            weight: 2,
          })}
        />
      )}

      {/* Bushfire risk overlay */}
      {showBushfire && (
        <GeoJSON
          data={{
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              properties: { name: "Bushfire Risk Zone", risk: "high" },
              geometry: {
                type: "Polygon",
                coordinates: [[
                  [144.893, -37.795], [144.906, -37.795],
                  [144.906, -37.810], [144.893, -37.810],
                  [144.893, -37.795],
                ]],
              },
            }],
          } as GeoJSON.FeatureCollection}
          style={() => ({
            fillColor: "#E74C3C",
            fillOpacity: 0.15,
            color: "#D35400",
            weight: 2,
            dashArray: "5, 5",
          })}
        />
      )}

      {/* Connection lines between cluster members */}
      {connectionLines.map(([from, to], i) => (
        <Polyline
          key={`line-${i}`}
          positions={[from, to]}
          pathOptions={{
            color: isCrisis ? "#E74C3C" : CLUSTER_COLORS[0],
            weight: 1.5,
            opacity: 0.4,
            dashArray: "4 4",
          }}
        />
      ))}



      {/* Cluster member markers */}
      {members.map((m, i) => {
        const isCurrentUser = m.user_id === currentUserId;
        const currentUserProfile = members.find((mem) => mem.user_id === currentUserId)?.profile;
        const dist = currentUserProfile
          ? haversineDistance(currentUserProfile.lat, currentUserProfile.lng, m.profile.lat, m.profile.lng)
          : 0;

        return (
          <Marker
            key={`member-${m.user_id}`}
            position={[m.profile.lat, m.profile.lng]}
            icon={createMarkerIcon(
              isCrisis ? "#E74C3C" : CLUSTER_COLORS[i % CLUSTER_COLORS.length],
              isCurrentUser,
              isCrisis
            )}
          >
            <Popup>
              <div className="text-sm min-w-[160px]">
                <strong className="text-base">{m.profile.name}</strong>
                {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                {dist > 0 && <p className="text-gray-500">{formatDistance(dist)} away</p>}
                <div className="flex flex-wrap gap-1 mt-1">
                  {m.capabilities.slice(0, 3).map((c, ci) => (
                    <span key={ci} className="text-xs">
                      {getCategoryIcon(c.category)} {c.tag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  🗣️ {m.profile.languages.join(", ")}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
