import { create } from 'zustand'

interface InvitationModalStore {
  isOpen: boolean
  companyId: string | null
  onOpen: (companyId: string) => void
  onClose: () => void
}

export const useInvitationModal = create<InvitationModalStore>((set) => ({
  isOpen: false,
  companyId: null,
  onOpen: (companyId: string) => set({ isOpen: true, companyId }),
  onClose: () => set({ isOpen: false, companyId: null }),
}))
