import type { P2PMessage } from "@/types";

type MessageHandler = (msg: P2PMessage) => void;

class P2PManager {
  private handlers: MessageHandler[] = [];
  private connected = false;
  private peerCount = 0;

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  private emit(msg: P2PMessage) {
    this.handlers.forEach((h) => h(msg));
  }

  // Simulated connection for hackathon demo
  async simulateConnect(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true;
        this.peerCount = 3;
        resolve(this.peerCount);
      }, 3000);
    });
  }

  simulateMessage(msg: P2PMessage) {
    this.emit(msg);
  }

  isConnected() {
    return this.connected;
  }

  getPeerCount() {
    return this.peerCount;
  }

  disconnect() {
    this.connected = false;
    this.peerCount = 0;
  }

  // Generate a QR payload for hub mode
  getHubPayload(userId: string, clusterName: string): string {
    return JSON.stringify({
      type: "kinship-p2p-hub",
      userId,
      clusterName,
      timestamp: new Date().toISOString(),
      offer: "simulated-webrtc-offer-" + Math.random().toString(36).substring(7),
    });
  }
}

export const p2pManager = new P2PManager();
