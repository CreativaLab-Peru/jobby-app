import { create } from 'zustand';

interface CvModalStore {
  isCreateOpen: boolean;
  isUploadOpen: boolean;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onOpenUpload: () => void;
  onCloseUpload: () => void;
}

export const useCvModalStore = create<CvModalStore>((set) => ({
  isCreateOpen: false,
  isUploadOpen: false,
  onOpenCreate: () => set({ isCreateOpen: true }),
  onCloseCreate: () => set({ isCreateOpen: false }),
  onOpenUpload: () => set({ isUploadOpen: true }),
  onCloseUpload: () => set({ isUploadOpen: false }),
}));
