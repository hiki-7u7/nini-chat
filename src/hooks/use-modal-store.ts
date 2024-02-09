import { create } from "zustand";

export type ModalType = 'createGroup';

interface ModalStore {
  type: ModalType | null,
  isOpen: boolean,
  onOpen: (type: ModalType) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ isOpen: false, type: null }),
}))