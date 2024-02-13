"use client";

import { FC } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal-store";
import { GroupInfo } from "../groups/group-info";

interface InfoGroupModalProps {

}

export const InfoGroupModal: FC<InfoGroupModalProps> = ({}) => {
  
  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === 'infoGroup';
  const isAdmin = data.currentMember?.role === 'ADMIN';

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={isModalOpen} onOpenChange={handleClose}>
      <GroupInfo onClose={handleClose} group={data.group!} members={data.members!} isAdmin={isAdmin}/>
    </Modal>
  )
}