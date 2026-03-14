"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onResults?: (results: unknown[]) => void;
  placeholder?: string;
}

export function SearchBar({ onResults, placeholder = "Find someone who speaks Vietnamese and has a car..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ name: string; capabilities: Array<{ tag: string }>; relevance?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&suburb=Footscray`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setResults(arr);
        onResults?.(arr);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
  }, [query, onResults]);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      {loading && <p className="text-sm text-textMuted mt-2 px-1">Searching...</p>}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto z-50">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {r.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-textMuted truncate">
                  {r.capabilities?.slice(0, 3).map((c) => c.tag.replace(/_/g, " ")).join(" • ")}
                </p>
              </div>
              {r.relevance && (
                <span className="text-xs text-success font-medium ml-auto shrink-0">
                  {Math.min(100, r.relevance * 20)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-sm text-textMuted mt-2 px-1">No results. Try broader terms.</p>
      )}
    </div>
  );
}
