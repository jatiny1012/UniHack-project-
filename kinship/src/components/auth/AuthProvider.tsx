"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useKinshipStore } from "@/lib/store";
import { loadAuthFromOffline } from "@/lib/db";

// Pages that don't require authentication
const PUBLIC_PATHS = ["/"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, setToken, setCurrentUser, setCapabilities, setNeeds, setCluster } = useKinshipStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Try to restore auth from Dexie (offline persistence)
      const stored = await loadAuthFromOffline();

      if (stored && stored.token) {
        // Restore auth state from Dexie into Zustand
        setToken(stored.token);
        if (stored.profile) setCurrentUser(stored.profile);

        // Route based on onboarding status
        if (PUBLIC_PATHS.includes(pathname)) {
          if (stored.onboarding_complete) {
            router.replace("/dashboard");
          } else {
            router.replace("/onboard");
          }
        }
      } else if (!PUBLIC_PATHS.includes(pathname) && pathname !== "/onboard") {
        // No token and trying to access protected route
        router.replace("/");
      }

      setIsLoading(false);
      setIsReady(true);
    };

    init();
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard: redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isReady) return;

    const currentToken = useKinshipStore.getState().token;

    if (!currentToken && !PUBLIC_PATHS.includes(pathname) && pathname !== "/onboard") {
      router.replace("/");
    }
  }, [pathname, isReady, router]);

  // Show loading spinner while checking auth on initial load
  if (isLoading && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen bg-warmWhite flex items-center justify-center">
        <div className="text-center animate-fade-slide-up">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-3">Kinship</h1>
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
