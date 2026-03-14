"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKinshipStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles, MapPin } from "lucide-react";
import { getCategoryIcon } from "@/lib/utils";
import toast from "react-hot-toast";

// Suburb → approximate center coordinates for Melbourne suburbs
const SUBURB_COORDS: Record<string, { lat: number; lng: number }> = {
  footscray: { lat: -37.7996, lng: 144.8994 },
  seddon: { lat: -37.8065, lng: 144.8913 },
  yarraville: { lat: -37.8165, lng: 144.8938 },
  maribyrnong: { lat: -37.7746, lng: 144.8884 },
  maidstone: { lat: -37.7745, lng: 144.8725 },
  "west footscray": { lat: -37.7975, lng: 144.8775 },
  braybrook: { lat: -37.7905, lng: 144.8575 },
  sunshine: { lat: -37.7880, lng: 144.8325 },
  "st albans": { lat: -37.7435, lng: 144.8003 },
  melbourne: { lat: -37.8136, lng: 144.9631 },
  "melbourne cbd": { lat: -37.8136, lng: 144.9631 },
  fitzroy: { lat: -37.7984, lng: 144.9780 },
  richmond: { lat: -37.8183, lng: 144.9987 },
  carlton: { lat: -37.7943, lng: 144.9671 },
  brunswick: { lat: -37.7668, lng: 144.9601 },
  collingwood: { lat: -37.8023, lng: 144.9876 },
  "south yarra": { lat: -37.8381, lng: 144.9929 },
  prahran: { lat: -37.8511, lng: 144.9919 },
  "st kilda": { lat: -37.8674, lng: 144.9808 },
  northcote: { lat: -37.7693, lng: 144.9995 },
  thornbury: { lat: -37.7546, lng: 144.9978 },
  preston: { lat: -37.7433, lng: 144.9958 },
  coburg: { lat: -37.7435, lng: 144.9644 },
  ascot: { lat: -37.7720, lng: 144.9130 },
  flemington: { lat: -37.7879, lng: 144.9291 },
  kensington: { lat: -37.7935, lng: 144.9270 },
  "port melbourne": { lat: -37.8375, lng: 144.9352 },
  williamstown: { lat: -37.8614, lng: 144.8988 },
  altona: { lat: -37.8670, lng: 144.8317 },
  newport: { lat: -37.8429, lng: 144.8826 },
  spotswood: { lat: -37.8315, lng: 144.8870 },
  hawthorn: { lat: -37.8226, lng: 145.0342 },
  camberwell: { lat: -37.8431, lng: 145.0700 },
  box: { lat: -37.8193, lng: 145.1266 },
  doncaster: { lat: -37.7850, lng: 145.1264 },
  heidelberg: { lat: -37.7567, lng: 145.0679 },
  ivanhoe: { lat: -37.7694, lng: 145.0454 },
};

const LANGUAGES = [
  "English", "Vietnamese", "Mandarin", "Hindi", "Arabic", "Somali",
  "Amharic", "Greek", "Italian", "Tamil", "Auslan", "French", "Spanish", "Other",
];

const CAPABILITY_OPTIONS = [
  { key: "vehicle", icon: "🚗", label: "Vehicle (car, ute, van)" },
  { key: "first_aid", icon: "🩺", label: "First Aid Training" },
  { key: "generator", icon: "⚡", label: "Generator / Solar / Battery" },
  { key: "spare_room", icon: "🏠", label: "Spare Room / Bed" },
  { key: "translation", icon: "🗣️", label: "Language Translation" },
  { key: "cooking", icon: "🍳", label: "Cook for Groups" },
  { key: "it_skills", icon: "💻", label: "IT / Tech Skills" },
  { key: "tools", icon: "🔧", label: "Tools / Equipment" },
  { key: "pet_care", icon: "🐕", label: "Can Mind Pets" },
  { key: "childcare", icon: "👶", label: "Childcare Experience" },
  { key: "radio", icon: "📻", label: "Radio / Comms" },
  { key: "physical", icon: "💪", label: "Physical Labour" },
];

const NEED_OPTIONS = [
  { key: "transport", icon: "🚗", label: "Transport / Evacuation" },
  { key: "medical", icon: "🩺", label: "Medical Support" },
  { key: "language", icon: "🗣️", label: "Language Help" },
  { key: "shelter", icon: "🏠", label: "Shelter" },
  { key: "power", icon: "⚡", label: "Power for Devices" },
  { key: "communication", icon: "📱", label: "Communication Help" },
  { key: "pet_care", icon: "🐕", label: "Pet Care During Evacuation" },
  { key: "mobility", icon: "♿", label: "Mobility Assistance" },
  { key: "childcare", icon: "👶", label: "Childcare" },
  { key: "elderly", icon: "👴", label: "Elderly Check-ins" },
  { key: "vision_hearing", icon: "👁️", label: "Vision / Hearing Support" },
];

export default function OnboardPage() {
  const router = useRouter();
  const { setCurrentUser, setCapabilities, setNeeds, setCluster, setOnboardingStep, onboardingStep } = useKinshipStore();
  const [step, setStep] = useState(onboardingStep);

  // Step 1 state
  const [name, setName] = useState("");
  const [suburb, setSuburb] = useState("Footscray");
  const [postcode, setPostcode] = useState("3011");
  const [approxLocation, setApproxLocation] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [geoLocation, setGeoLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  // Try to get browser geolocation on mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus("📍 Using your actual location");
        },
        () => {
          setLocationStatus("📍 Using suburb center");
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Get coordinates based on suburb name or geolocation
  const getUserCoords = () => {
    // If browser geolocation is available, use it
    if (geoLocation) return geoLocation;
    // Look up suburb in our table
    const suburbKey = suburb.toLowerCase().trim();
    if (SUBURB_COORDS[suburbKey]) {
      const base = SUBURB_COORDS[suburbKey];
      // Add small random offset for privacy
      return {
        lat: base.lat + (Math.random() - 0.5) * 0.005,
        lng: base.lng + (Math.random() - 0.5) * 0.005,
      };
    }
    // Final fallback: Footscray
    return {
      lat: -37.7996 + (Math.random() - 0.5) * 0.005,
      lng: 144.8994 + (Math.random() - 0.5) * 0.005,
    };
  };

  // Step 2 state
  const [selectedCaps, setSelectedCaps] = useState<string[]>([]);
  const [capFreeText, setCapFreeText] = useState("");

  // Step 3 state
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [needFreeText, setNeedFreeText] = useState("");

  // Loading/confirmation state
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [parsedCaps, setParsedCaps] = useState<Array<{ tag: string; category: string; detail?: string }>>([]);
  const [parsedNeeds, setParsedNeeds] = useState<Array<{ tag: string; category: string; priority?: number }>>([]);

  const toggleLang = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleCap = (key: string) => {
    setSelectedCaps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleNeed = (key: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    setLoading(true);

    try {
      // 1. Create user — use actual coordinates from suburb lookup or geolocation
      const coords = getUserCoords();

      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, suburb, postcode,
          lat: coords.lat,
          lng: coords.lng,
          approximate_location: approxLocation,
          household_size: householdSize,
          languages: selectedLanguages,
        }),
      });
      const user = await userRes.json();
      setCurrentUser(user);

      // 2. Parse capabilities/needs
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          raw_capabilities_text: capFreeText,
          raw_needs_text: needFreeText,
          checkbox_capabilities: selectedCaps,
          checkbox_needs: selectedNeeds,
        }),
      });
      const parsed = await parseRes.json();
      setCapabilities(parsed.capabilities || []);
      setNeeds(parsed.needs || []);
      setParsedCaps(parsed.capabilities || []);
      setParsedNeeds(parsed.needs || []);

      // 3. Get/create cluster
      const clusterRes = await fetch(`/api/clusters?user_id=${user.id}`);
      const clusterData = await clusterRes.json();
      if (clusterData && !clusterData.error) {
        setCluster(clusterData);
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const goToStep = (s: number) => {
    setStep(s);
    setOnboardingStep(s);
  };

  if (loading) return <LoadingScreen />;

  if (showConfirmation) {
    return (
      <main className="min-h-screen bg-warmWhite p-4 flex items-center justify-center">
        <div className="max-w-lg w-full space-y-6 animate-fade-slide-up">
          <div className="text-center">
            <Sparkles className="mx-auto text-accent mb-3" size={40} />
            <h2 className="text-2xl font-bold text-textDark mb-2">We understood this about you</h2>
            <p className="text-textMuted">Look right?</p>
          </div>

          <Card>
            <h3 className="font-semibold text-textDark mb-2">What you can offer</h3>
            <div className="flex flex-wrap gap-2">
              {parsedCaps.map((c, i) => (
                <Badge key={i} variant="success">
                  {getCategoryIcon(c.category)} {c.tag.replace(/_/g, " ")}
                </Badge>
              ))}
              {parsedCaps.length === 0 && <p className="text-sm text-textMuted">No capabilities detected</p>}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-textDark mb-2">What you might need</h3>
            <div className="flex flex-wrap gap-2">
              {parsedNeeds.map((n, i) => (
                <Badge key={i} variant={n.priority === 1 ? "danger" : n.priority === 2 ? "accent" : "muted"}>
                  {n.tag.replace(/_/g, " ")}
                  {n.priority === 1 && " (critical)"}
                  {n.priority === 2 && " (important)"}
                </Badge>
              ))}
              {parsedNeeds.length === 0 && <p className="text-sm text-textMuted">No needs detected</p>}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowConfirmation(false)} className="flex-1">
              Edit
            </Button>
            <Button variant="primary" onClick={() => router.push("/dashboard")} className="flex-1">
              Looks Good →
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warmWhite p-4">
      <div className="max-w-lg mx-auto pt-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s === step ? "bg-primary scale-125" : s < step ? "bg-success" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-slide-up">
            <h2 className="text-2xl font-bold text-textDark">Let&apos;s get you set up</h2>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Display name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="First name or nickname"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-textDark mb-1">Suburb</label>
                <input
                  type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textDark mb-1">Postcode</label>
                <input
                  type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Approximate location</label>
              <input
                type="text" value={approxLocation} onChange={(e) => setApproxLocation(e.target.value)}
                placeholder="e.g., near Barkly St"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Household size</label>
              <input
                type="number" min={1} max={10} value={householdSize}
                onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
                className="w-24 rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-2">Languages spoken</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLang(lang)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedLanguages.includes(lang)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-textMuted hover:bg-gray-200"
                    }`}
                  >
                    {selectedLanguages.includes(lang) && <Check size={14} className="inline mr-1" />}
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-textMuted flex items-center gap-1.5">
              <Lock size={14} /> We never store your exact address
            </p>

            <Button onClick={() => goToStep(2)} className="w-full" disabled={!name.trim()}>
              Next <ArrowRight size={18} />
            </Button>
          </div>
        )}

        {/* Step 2: Capabilities */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-slide-up">
            <h2 className="text-2xl font-bold text-textDark">What can you offer in an emergency?</h2>
            <p className="text-textMuted">Don&apos;t worry — you probably have more to offer than you think.</p>

            <div className="grid grid-cols-2 gap-2">
              {CAPABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => toggleCap(opt.key)}
                  className={`p-3 rounded-xl border text-left transition-all text-sm ${
                    selectedCaps.includes(opt.key)
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <p className="font-medium text-textDark mt-1">{opt.label}</p>
                  {selectedCaps.includes(opt.key) && (
                    <Check size={16} className="text-primary mt-1" />
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Tell us more (optional)</label>
              <textarea
                value={capFreeText} onChange={(e) => setCapFreeText(e.target.value)}
                placeholder="e.g., I have a ute that fits 5 people, I'm a trained paramedic, I have a large water tank..."
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => goToStep(1)}>
                <ArrowLeft size={18} /> Back
              </Button>
              <Button onClick={() => goToStep(3)} className="flex-1">
                Next <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Needs */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-slide-up">
            <h2 className="text-2xl font-bold text-textDark">What might you need help with?</h2>
            <p className="text-textMuted">There&apos;s no shame in needing help. That&apos;s what neighbours are for.</p>

            <div className="grid grid-cols-2 gap-2">
              {NEED_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => toggleNeed(opt.key)}
                  className={`p-3 rounded-xl border text-left transition-all text-sm ${
                    selectedNeeds.includes(opt.key)
                      ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <p className="font-medium text-textDark mt-1">{opt.label}</p>
                  {selectedNeeds.includes(opt.key) && (
                    <Check size={16} className="text-accent mt-1" />
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Anything else we should know? (optional)</label>
              <textarea
                value={needFreeText} onChange={(e) => setNeedFreeText(e.target.value)}
                placeholder="e.g., My mother lives with me, she's 82 and uses a wheelchair. She only speaks Vietnamese..."
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => goToStep(2)}>
                <ArrowLeft size={18} /> Back
              </Button>
              <Button variant="accent" onClick={handleSubmit} className="flex-1">
                <Sparkles size={18} /> Find My Cluster
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
