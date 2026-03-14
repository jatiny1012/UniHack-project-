import { create } from "zustand";
import type { UserProfile, Capability, Need, Cluster, CheckIn, ConnectivityMode } from "@/types";

interface KinshipStore {
  // Auth state
  token: string | null;
  setToken: (token: string | null) => void;
  // User state
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  capabilities: Capability[];
  setCapabilities: (caps: Capability[]) => void;
  needs: Need[];
  setNeeds: (needs: Need[]) => void;
  cluster: Cluster | null;
  setCluster: (cluster: Cluster | null) => void;
  checkIns: CheckIn[];
  setCheckIns: (checkIns: CheckIn[]) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  connectivity: ConnectivityMode;
  setConnectivity: (mode: ConnectivityMode) => void;
  connectedPeers: number;
  setConnectedPeers: (count: number) => void;
  isCrisisActive: boolean;
  setCrisisActive: (active: boolean) => void;
  isSimulation: boolean;
  setSimulation: (sim: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  // Auth actions
  logout: () => void;
}

// Helper to persist/restore token from localStorage
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kinship_token");
}

export const useKinshipStore = create<KinshipStore>((set) => ({
  // Auth
  token: getStoredToken(),
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("kinship_token", token);
      } else {
        localStorage.removeItem("kinship_token");
      }
    }
    set({ token });
  },
  // User
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  capabilities: [],
  setCapabilities: (capabilities) => set({ capabilities }),
  needs: [],
  setNeeds: (needs) => set({ needs }),
  cluster: null,
  setCluster: (cluster) => set({ cluster }),
  checkIns: [],
  setCheckIns: (checkIns) => set({ checkIns }),
  addCheckIn: (checkIn) => set((state) => ({ checkIns: [...state.checkIns, checkIn] })),
  connectivity: "online",
  setConnectivity: (connectivity) => set({ connectivity }),
  connectedPeers: 0,
  setConnectedPeers: (connectedPeers) => set({ connectedPeers }),
  isCrisisActive: false,
  setCrisisActive: (isCrisisActive) => set({ isCrisisActive }),
  isSimulation: false,
  setSimulation: (isSimulation) => set({ isSimulation }),
  onboardingStep: 1,
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  // Auth actions
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kinship_token");
    }
    set({
      token: null,
      currentUser: null,
      capabilities: [],
      needs: [],
      cluster: null,
      checkIns: [],
      isCrisisActive: false,
      isSimulation: false,
      onboardingStep: 1,
    });
  },
}));
