"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Radio } from "lucide-react";
import { useKinshipStore } from "@/lib/store";

export function ConnectivityBanner() {
  const { connectivity, setConnectivity, connectedPeers } = useKinshipStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setConnectivity("online");
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };
    const handleOffline = () => {
      setConnectivity("offline");
      setVisible(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      setConnectivity("offline");
      setVisible(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setConnectivity]);

  if (connectivity === "online" && !visible) return null;

  const config = {
    online: {
      bg: "bg-success/10",
      text: "text-success",
      icon: Wifi,
      label: "Online",
    },
    offline: {
      bg: "bg-accent/10",
      text: "text-accent",
      icon: WifiOff,
      label: "Offline — Cached data",
    },
    p2p: {
      bg: "bg-primary-light/10",
      text: "text-primary-light",
      icon: Radio,
      label: `P2P — ${connectedPeers} devices`,
    },
  }[connectivity];

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <config.icon size={12} />
      {config.label}
    </div>
  );
}
