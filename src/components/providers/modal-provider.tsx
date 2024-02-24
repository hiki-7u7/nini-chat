'use client';

import { useEffect, useState } from "react";

import { CreateGroupModal } from "@/components/modals/create-group-modal";
import { InfoGroupModal } from "@/components/modals/info-group-modal";
import { LeaveGroupModal } from "@/components/modals/leave-group-modal";
import { DeleteGroupModal } from "@/components/modals/delete-group-modal";

export const ModalProvider = ({}) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, []);

  if(!isMounted) {
    return null
  }

  return (
    <>
      <CreateGroupModal />
      <InfoGroupModal />
      <LeaveGroupModal />
      <DeleteGroupModal />
    </>
  )
}