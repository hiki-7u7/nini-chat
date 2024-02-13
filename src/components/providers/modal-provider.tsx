'use client';

import { useEffect, useState } from "react";
import { CreateGroupModal } from "@/components/modals/create-group-modal";
import { InfoGroupModal } from "../modals/info-group-modal";

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
    </>
  )
}