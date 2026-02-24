import { create } from 'zustand'

interface CreditModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useCreditModal = create<CreditModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
