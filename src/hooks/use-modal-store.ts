import { MemberWithProfile } from "@/types/group";
import { Group } from "@prisma/client";
import { create } from "zustand";

export type ModalType = 'createGroup' | 'infoGroup';

type ModalData = {
  group?: Group,
  members?: MemberWithProfile[],
  currentMember?: MemberWithProfile,
}

interface ModalStore {
  data: ModalData,
  type: ModalType | null,
  isOpen: boolean,
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  data: {},
  isOpen: false,
  type: null,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ isOpen: false, type: null }),
}))