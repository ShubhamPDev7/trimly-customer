import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ActiveQueueEntry {
  shopId: string
  entryId: string
  shopName: string
}

interface QueueState {
  activeEntry: ActiveQueueEntry | null
  setActiveEntry: (entry: ActiveQueueEntry) => void
  clearActiveEntry: () => void
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set) => ({
      activeEntry: null,
      setActiveEntry: (entry) => set({ activeEntry: entry }),
      clearActiveEntry: () => set({ activeEntry: null }),
    }),
    {
      name: "trimly-customer-queue",
    }
  )
)