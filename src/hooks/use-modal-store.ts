import { MemberWithProfile } from "@/types/group";
import { Conversation, Group, Profile } from "@prisma/client";
import { create } from "zustand";

export type ModalType = 'createGroup' | 'infoGroup' | 'leaveGroup' | 'deleteGroup' | 'friendRequest' | 'infoProfile' | 'deleteFriend';

type ModalData = {
  group?: Group,
  members?: MemberWithProfile[],
  currentMember?: MemberWithProfile,
  conversation?: Conversation,
  conversationProfile?: Profile
}

type ModalDataType = Group | MemberWithProfile[] | MemberWithProfile | Conversation | Profile;

interface ModalStore {
  data: ModalData,
  type: ModalType | null,
  isOpen: boolean,
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  setData: ( dataType: keyof ModalData, updatedData: ModalDataType  ) => void;
};

export const useModal = create<ModalStore>((set) => ({
  data: {},
  isOpen: false,
  type: null,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ isOpen: false, type: null }),
  setData: (dataType, updatedData) => set((state) => ({
    data: { ...state.data, [dataType]: updatedData }
  }))
}))