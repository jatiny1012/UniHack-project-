"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Map, AlertTriangle, User, Search, LogOut } from "lucide-react";
import { useKinshipStore } from "@/lib/store";
import { clearAuthFromOffline } from "@/lib/db";
import { ConnectivityBanner } from "./ConnectivityBanner";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCrisisActive, token, logout } = useKinshipStore();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await clearAuthFromOffline();
    logout();
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", icon: Map, label: "Dashboard" },
    { href: "/crisis", icon: AlertTriangle, label: "Crisis" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        isCrisisActive ? "bg-danger/95 border-danger" : "bg-white/90 border-gray-100"
      }`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className={`text-xl font-extrabold tracking-tight ${
              isCrisisActive ? "text-white" : "text-primary"
            }`}>
              Kinship
            </Link>

            <ConnectivityBanner />

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-lg transition-colors ${
                  isCrisisActive ? "text-white hover:bg-white/20" : "text-textMuted hover:bg-gray-100"
                }`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-2 rounded-lg transition-colors ${
                      isCrisisActive
                        ? isActive ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
                        : isActive ? "bg-primary/10 text-primary" : "text-textMuted hover:bg-gray-100"
                    }`}
                    aria-label={item.label}
                  >
                    <item.icon size={20} />
                  </Link>
                );
              })}

              {/* Logout button */}
              {token && (
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-colors ${
                    isCrisisActive
                      ? "text-white/70 hover:bg-white/10"
                      : "text-textMuted hover:bg-red-50 hover:text-danger"
                  }`}
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showSearch && (
        <div className="sticky top-14 z-40 bg-white border-b border-gray-100 px-4 py-3 animate-fade-slide-up">
          <SearchBarInline onClose={() => setShowSearch(false)} />
        </div>
      )}
    </>
  );
}

function SearchBarInline({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ name: string; capabilities: Array<{ tag: string }> }>>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useKinshipStore();

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&suburb=Footscray`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch { setResults([]); }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Find someone who speaks Vietnamese and has a car..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          autoFocus
        />
        <button
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textDark"
        >
          ✕
        </button>
      </div>

      {loading && <p className="text-sm text-textMuted mt-2">Searching...</p>}

      {results.length > 0 && (
        <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                {r.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-textMuted">
                  {r.capabilities?.slice(0, 3).map((c) => c.tag.replace(/_/g, " ")).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-sm text-textMuted mt-2">No results found. Try broader terms.</p>
      )}
    </div>
  );
}
