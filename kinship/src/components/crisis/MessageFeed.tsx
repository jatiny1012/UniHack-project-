"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface MessageFeedProps {
  simulation?: boolean;
}

const MOCK_MESSAGES: Omit<Message, "id">[] = [
  { sender: "Sarah", text: "Generator is running at my place, come over if you need power", timestamp: "" },
  { sender: "Raj", text: "I can drive to pick up anyone who needs evacuation", timestamp: "" },
  { sender: "Maria", text: "I have first aid supplies. Setting up a triage area at Sarah's house", timestamp: "" },
  { sender: "Omar", text: "Van is ready, can fit 8 people. Meet at corner of Barkly and Nicholson", timestamp: "" },
];

export function MessageFeed({ simulation }: MessageFeedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!simulation) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= MOCK_MESSAGES.length) { clearInterval(interval); return; }
      const mock = MOCK_MESSAGES[idx];
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}-${idx}`,
        sender: mock.sender,
        text: mock.text,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      idx++;
    }, 2500);
    return () => clearInterval(interval);
  }, [simulation]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}`,
      sender: "You",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-64">
      <h3 className="font-semibold text-textDark mb-2">Cluster Messages</h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-textMuted text-center py-8">No messages yet</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm animate-fade-slide-up ${
              msg.sender === "You" ? "bg-primary/10 ml-8" : "bg-gray-50 mr-8"
            }`}
          >
            <p className="font-semibold text-textDark text-xs">{msg.sender}</p>
            <p className="text-textDark">{msg.text}</p>
            <p className="text-xs text-textMuted mt-0.5">{msg.timestamp}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Send a message to your cluster"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
