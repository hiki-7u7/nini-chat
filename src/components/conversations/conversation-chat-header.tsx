"use client";

import { Conversation, Profile } from "@prisma/client";
import Image from "next/image";
import { FC, useState } from "react";
import { Icons } from "../icons";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

interface ConversationChatHeaderProps {
  conversation: Conversation,
  conversationProfile: Profile
}

export const ConversationChatHeader: FC<ConversationChatHeaderProps> = ({ conversation, conversationProfile }) => {

  const [showOptions, setShowOptions] = useState(false);
  const { onOpen } = useModal();

  const handleAction = (action: string) => {
    switch (action) {
      case 'infoProfile':
        setShowOptions(false);
        onOpen('infoProfile', { conversation, conversationProfile })
        break;
      case 'deleteFriend':
        setShowOptions(false);
        onOpen('deleteFriend', { conversation, conversationProfile })
        break;
      default:
        break;
    }
  }


  return (
    <>
    <div 
      className="
        h-[70px] 
        border-b-2 
        bg-[#292929] 
        border-[#212121] 
        flex 
        items-center 
        px-[15px] 
        justify-between 
        relative 
        z-20
      "
    >

      <div className="flex items-center gap-x-[15px]">
        <div
          className="
            relative
            h-[45px]
            w-[45px]
            rounded-full
          "
        >
          <Image
            alt="friend image"
            src={conversationProfile!.imageUrl}
            fill
            className="rounded-full"
          />
        </div>
        <p className="text-white text-lg font-semibold">{conversationProfile!.name}</p>
      </div>

      <div className="flex text-white gap-x-[10px]">
        <div className="p-[10px] hover:bg-[#333333] rounded-full cursor-pointer">
          <Icons.Video className="h-[25px] w-[25px]"/>
        </div>
        <div onClick={() => setShowOptions(!showOptions)} className="p-[10px] hover:bg-[#333333] rounded-full cursor-pointer">
          <Icons.MoreVertical className="h-[25px] w-[25px]"/>
        </div>
      </div>

    </div>
    <div className={cn(`
      h-[80px]
      w-[200px]
      bg-[#292929]
      border-b-2
      border-x-2
      border-[#212121]
      rounded-b-[5px]
      absolute
      z-10
      overflow-hidden
      transition-all`,
      showOptions ? "-bottom-[80px] right-[15px]" : "bottom-0 right-[15px]"
    )}>
      
      <div 
        onClick={() => handleAction('infoProfile')} 
        className="hover:bg-[#333333] cursor-pointer h-[40px] flex items-center px-[10px] border-b-2 border-[#212121]"
      >
        <p className="text-white text-[13px] font-medium">Info. del perfil</p>
      </div>
      
      <div 
        onClick={() => handleAction('deleteFriend')} 
        className="hover:bg-[#333333] cursor-pointer h-[40px] flex items-center px-[10px] border-b-2 border-[#212121]"
      >
        <p className="text-white text-[13px] font-medium">Eliminar de amigos</p>
      </div>

    </div>
  </>
  )
}