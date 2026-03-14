import { create } from "zustand";
import type { UserProfile, Capability, Need, Cluster, CheckIn, ConnectivityMode } from "@/types";

interface KinshipStore {
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
}

export const useKinshipStore = create<KinshipStore>((set) => ({
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
}));
