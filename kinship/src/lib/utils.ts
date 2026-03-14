export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function fuzzLocation(lat: number, lng: number): { lat: number; lng: number } {
  const offset = 0.0005;
  return {
    lat: lat + (Math.random() - 0.5) * offset * 2,
    lng: lng + (Math.random() - 0.5) * offset * 2,
  };
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    transport: "🚗",
    medical: "🩺",
    shelter: "🏠",
    power: "⚡",
    communication: "📡",
    food: "🍳",
    physical_help: "💪",
    childcare: "👶",
    language: "🗣️",
    equipment: "🔧",
    care: "🤝",
  };
  return icons[category] || "📋";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    transport: "Transport",
    medical: "Medical",
    shelter: "Shelter",
    power: "Power",
    communication: "Communication",
    food: "Food & Cooking",
    physical_help: "Physical Help",
    childcare: "Childcare",
    language: "Language",
    equipment: "Equipment",
    care: "Care",
  };
  return labels[category] || category;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
