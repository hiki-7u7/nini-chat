"use client";

import { Group } from "@prisma/client";
import Image from "next/image";
import { FC, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { MemberWithProfile } from "@/types/group";

interface GroupChatHeaderProps {
  group: Group,
  members: MemberWithProfile[],
  currentMember: MemberWithProfile,
}


export const GroupChatHeader: FC<GroupChatHeaderProps> = ({ group, members, currentMember }) => {

  const [showOptions, setShowOptions] = useState(false);
  const { onOpen } = useModal();

  const handleAction = (action: string) => {
    switch (action) {
      case 'infoGroup':
        setShowOptions(false);
        onOpen('infoGroup', { group, members, currentMember })
        break;
      case 'leaveGroup':
        console.log('leaveGroup')
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="h-[70px] border-b-2 bg-[#292929] border-[#212121] flex items-center px-[10px] justify-between relative z-20">

        <div className="flex items-center gap-x-[10px]">
          <div
            className="
              relative
              h-[45px]
              w-[45px]
              rounded-full
            "
          >
            <Image
              alt="group image"
              src={group.imageUrl}
              fill
              className="rounded-full"
            />
          </div>
          <p className="text-white">{group.name}</p>
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
        z-0
        overflow-hidden
        transition-all`,
        showOptions ? "-bottom-[80px] right-[15px]" : "bottom-0 right-[15px]"
      )}>
        

          
        <div 
          onClick={() => handleAction('infoGroup')} 
          className="hover:bg-[#333333] cursor-pointer h-[40px] flex items-center px-[10px] border-b-2 border-[#212121]"
        >
          <p className="text-white text-[13px] font-medium">Info. del grupo</p>
        </div>
        
        { currentMember.role === 'GUEST' && (
          <div 
            onClick={() => handleAction('leaveGroup')} 
            className="hover:bg-[#333333] cursor-pointer h-[40px] flex items-center px-[10px] border-b-2 border-[#212121]"
          >
            <p className="text-white text-[13px] font-medium">Salir de grupo</p>
          </div>
        )}

        { currentMember.role === 'ADMIN' && (
          <div 
            onClick={() => handleAction('DeleteGroup')} 
            className="hover:bg-[#333333] cursor-pointer h-[40px] flex items-center px-[10px] border-b-2 border-[#212121]"
          >
            <p className="text-white text-[13px] font-medium">Eliminar grupo</p>
          </div>
        )}

      </div>
    </>
  )
}