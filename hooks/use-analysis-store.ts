import { create } from 'zustand';
import { get, set, del } from 'idb-keyval';

interface AnalysisState {
  userId: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileBlob: Blob | null; // Guardaremos el binario aquí
  isAnalyzing: boolean;
  setFileData: (file: File, userId: string) => Promise<void>;
  loadPersistedFile: () => Promise<void>; // Para recuperar al abrir nueva pestaña
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((setStore) => ({
  userId: null,
  fileUrl: null,
  fileName: null,
  fileBlob: null,
  isAnalyzing: false,

  setFileData: async (file, userId) => {
    const url = URL.createObjectURL(file);

    // 1. Guardar en IndexedDB para persistencia entre pestañas
    await set('pending_cv_file', file);
    await set('pending_cv_metadata', { fileName: file.name, userId });

    setStore({
      fileUrl: url,
      fileName: file.name,
      fileBlob: file,
      userId,
    });
  },

  loadPersistedFile: async () => {
    const file = await get<File>('pending_cv_file');
    const metadata = await get<{fileName: string, userId: string}>('pending_cv_metadata');
    if (file && metadata) {
      const url = URL.createObjectURL(file);
      setStore({
        fileUrl: url,
        fileName: metadata.fileName,
        userId: metadata.userId,
        fileBlob: file
      });
    }
  },

  reset: () => {
    del('pending_cv_file');
    del('pending_cv_metadata');
    setStore({ userId: null, fileUrl: null, fileName: null, fileBlob: null, isAnalyzing: false });
  },
}));
