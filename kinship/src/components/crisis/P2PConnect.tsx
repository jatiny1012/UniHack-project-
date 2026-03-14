"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { p2pManager } from "@/lib/p2p";
import { Wifi, Radio, QrCode } from "lucide-react";
import { useKinshipStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

interface P2PConnectProps {
  userId: string;
  clusterName: string;
}

export function P2PConnect({ userId, clusterName }: P2PConnectProps) {
  const [mode, setMode] = useState<"idle" | "hub" | "peer">("idle");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const { setConnectivity, setConnectedPeers } = useKinshipStore();

  const handleConnect = async () => {
    setConnecting(true);
    const peerCount = await p2pManager.simulateConnect();
    setConnected(true);
    setConnecting(false);
    setConnectivity("p2p");
    setConnectedPeers(peerCount);
  };

  const qrPayload = p2pManager.getHubPayload(userId, clusterName);

  if (mode === "idle") {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-textDark flex items-center gap-2">
          <Radio size={18} />
          Peer-to-Peer Connection
        </h3>
        <p className="text-sm text-textMuted">
          Connect directly to your cluster when the internet is down.
        </p>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => { setMode("hub"); handleConnect(); }} className="flex-1">
            <QrCode size={18} />
            Be the Hub
          </Button>
          <Button variant="secondary" onClick={() => setMode("peer")} className="flex-1">
            <Wifi size={18} />
            Join as Peer
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "hub") {
    return (
      <div className="space-y-3 text-center">
        <h3 className="font-semibold text-textDark">Hub Mode</h3>
        <p className="text-sm text-textMuted">Other devices can scan this QR code to connect</p>
        <div className="flex justify-center py-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <QRCodeSVG value={qrPayload} size={180} />
          </div>
        </div>
        {connecting && (
          <p className="text-sm text-primary animate-pulse">Establishing connection...</p>
        )}
        {connected && (
          <div className="flex items-center justify-center gap-2 text-sm text-success font-medium">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Connected — {p2pManager.getPeerCount()} devices
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => { setMode("idle"); p2pManager.disconnect(); setConnectivity("online"); }}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-center">
      <h3 className="font-semibold text-textDark">Peer Mode</h3>
      <p className="text-sm text-textMuted">Scan the QR code on the hub device to connect</p>
      <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-200">
        <QrCode size={48} className="mx-auto text-textMuted mb-2" />
        <p className="text-sm text-textMuted">Point camera at hub QR code</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setMode("idle")}>
        Cancel
      </Button>
    </div>
  );
}
