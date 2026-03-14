"use client";

import Link from "next/link";
import { ArrowRight, Lock, Users, Brain, Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  const handleSeed = async () => {
    try {
      await fetch("/api/seed", { method: "POST" });
    } catch { /* silent */ }
  };

  return (
    <main className="min-h-screen bg-warmWhite">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight mb-4">
          Kinship
        </h1>
        <p className="text-xl md:text-2xl text-textDark font-semibold leading-relaxed mb-2">
          Find your people before you need them.
        </p>
        <p className="text-xl md:text-2xl text-textDark font-bold leading-relaxed mb-6">
          Stay connected when the internet can&apos;t.
        </p>
        <p className="text-base text-textMuted max-w-2xl mx-auto leading-relaxed mb-10">
          During a crisis, your nearest help is your neighbour — someone 30 metres away
          that you&apos;ve never met. Kinship changes that.
        </p>

        <Link href="/onboard">
          <Button size="lg" className="shadow-lg text-lg px-10">
            Join Your Neighbourhood
            <ArrowRight size={20} />
          </Button>
        </Link>

        <p className="mt-4 text-sm text-textMuted flex items-center justify-center gap-1.5">
          <Lock size={14} />
          Privacy by design — we never store your exact address
        </p>
      </section>

      {/* Value Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">
              <Users className="mx-auto text-primary" size={40} />
            </div>
            <h3 className="text-lg font-bold text-textDark mb-2">
              🤝 Share what you can offer
            </h3>
            <p className="text-sm text-textMuted">
              Car, spare room, first aid, language skills — everyone has something.
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">
              <Brain className="mx-auto text-primary" size={40} />
            </div>
            <h3 className="text-lg font-bold text-textDark mb-2">
              🧠 AI builds your resilience cluster
            </h3>
            <p className="text-sm text-textMuted">
              Matched with complementary neighbours within walking distance.
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">
              <Radio className="mx-auto text-primary" size={40} />
            </div>
            <h3 className="text-lg font-bold text-textDark mb-2">
              📡 Works even offline
            </h3>
            <p className="text-sm text-textMuted">
              Peer-to-peer on local WiFi when the internet drops.
            </p>
          </Card>
        </div>
      </section>

      {/* Dev-mode seed button */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleSeed}
            className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-50 hover:opacity-100"
          >
            Seed DB
          </button>
        </div>
      )}
    </main>
  );
}
