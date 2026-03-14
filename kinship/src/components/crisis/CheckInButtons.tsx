"use client";

import { useState } from "react";
import { Check, AlertCircle, HeartHandshake, LogOut } from "lucide-react";
import toast from "react-hot-toast";

interface CheckInButtonsProps {
  userId: string;
  clusterId: string;
  crisisEventId?: string;
  onCheckIn?: (status: string, message?: string) => void;
}

export function CheckInButtons({ userId, clusterId, crisisEventId, onCheckIn }: CheckInButtonsProps) {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (status: string) => {
    setLoading(true);
    try {
      await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          cluster_id: clusterId,
          crisis_event_id: crisisEventId,
          status,
          message: message || "",
        }),
      });
      setSubmitted(status);
      onCheckIn?.(status, message);
      toast.success("Status sent ✓");
    } catch {
      toast.error("Failed to send status");
    }
    setLoading(false);
  };

  const buttons = [
    { status: "safe", label: "I'm Safe", icon: Check, color: "bg-success hover:bg-success/90", needsInput: false },
    { status: "need_help", label: "I Need Help", icon: AlertCircle, color: "bg-danger hover:bg-danger/90", needsInput: true },
    { status: "helping_others", label: "I'm Helping Others", icon: HeartHandshake, color: "bg-primary-light hover:bg-primary-light/90", needsInput: true },
    { status: "evacuated", label: "I've Evacuated", icon: LogOut, color: "bg-accent hover:bg-accent/90", needsInput: true },
  ];

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-xl">
          <Check size={20} />
          <span className="font-semibold">
            Status: {buttons.find((b) => b.status === submitted)?.label}
          </span>
        </div>
        <button
          onClick={() => { setSubmitted(null); setShowInput(null); setMessage(""); }}
          className="block mx-auto mt-2 text-sm text-textMuted hover:text-primary"
        >
          Change status
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-textDark mb-3">Let your cluster know you&apos;re safe</h3>
      {buttons.map((btn) => (
        <div key={btn.status}>
          <button
            onClick={() => btn.needsInput ? setShowInput(btn.status) : handleCheckIn(btn.status)}
            disabled={loading}
            className={`w-full ${btn.color} text-white rounded-xl px-4 py-4 font-semibold text-left flex items-center gap-3 transition-colors disabled:opacity-50`}
            style={{ minHeight: "60px" }}
          >
            <btn.icon size={24} />
            {btn.label}
          </button>
          {showInput === btn.status && (
            <div className="mt-1 flex gap-2 animate-fade-slide-up">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)..."
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <button
                onClick={() => handleCheckIn(btn.status)}
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Send
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
