"use client";

import { FC } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { formattedDate } from "@/helpers/format-message-date";
import { useParams } from "next/navigation";

export const InfoProfileModal: FC = ({}) => {

  const params = useParams();

  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === 'infoProfile';

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={isModalOpen} onOpenChange={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-[#212121] 
          p-[20px]
          w-[500px]
          rounded-[5px]
          border-[1px]
          border-[#808080]
          relative
          flex
          flex-col
          items-center
        "
      >
        
        <Icons.X
          onClick={() => onClose()}
          className="
            cursor-pointer
            text-[#808080]
            hover:text-white
            absolute 
            top-[10px] 
            right-[10px]
            z-20
          "
        />

        <div className="relative h-[125px] w-[125px] rounded-full mt-[20px]">
          <Image 
            fill
            src={data.conversationProfile?.imageUrl!}
            alt="image group"
            className="rounded-full"
          />
        </div>

        <div className="mt-[40px] w-full flex flex-col gap-y-[20px]">
          
          <div className="flex flex-col gap-y-2">
            <p className="text-[#808080] font-semibold text-xs">Name</p>
            <div className="bg-[#404040] rounded-[5px] h-[40px] px-[10px] flex items-center">
              <p className="text-white text-sm">{data.conversationProfile?.name}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-y-2">
            <p className="text-[#808080] font-semibold text-xs">Amigos desde el</p>
            <div className="bg-[#404040] rounded-[5px] h-[40px] px-[10px] flex items-center">
              <p className="text-white text-sm">{formattedDate(new Date(data.conversation?.createdAt!))}</p>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-[#808080] font-semibold text-xs">Se unio el</p>
            <div className="bg-[#404040] rounded-[5px] h-[40px] px-[10px] flex items-center">
              <p className="text-white text-sm">{formattedDate(new Date(data.conversationProfile?.createdAt!))}</p>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  )
}