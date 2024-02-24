"use client";

import { FC, Fragment } from "react";

import { useChatQuery } from "@/hooks/use-chat-query";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/types/group";
import { Icons } from "@/components/icons";
import { GroupChatMessage } from "./group-chat-message";

interface GroupMessagesProps {
  groupId: string,
  currentMember: MemberWithProfile
}

export const GroupMessages: FC<GroupMessagesProps> = ({ groupId, currentMember }) => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useChatQuery({ groupId });

  if(status === "pending"){
    return (
      <div className="flex flex-1 justify-center items-center bg-[#2B2B2B]">
        <div className="flex flex-col items-center gap-y-3">
          <Icons.Loader2 className="text-white animate-spin"/>
          <p className="text-white text-sm">Cargando mensajes</p>
        </div>
      </div>
    )
  }

  if(status === "error"){
    return (
      <div className="flex flex-1 justify-center items-center bg-[#2B2B2B]">
        <div className="flex flex-col items-center gap-y-3">
          <Icons.ServerCrash className="text-white"/>
          <p className="text-white text-sm">Hubo un error</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="
        relative
        bg-[#2B2B2B]
        -z-0
        flex-1 
        flex 
        flex-col 
        overflow-y-auto
        scrollbar-with
        scrollbar-thumb
        scrollbar-track
      "
    >

    <div className="flex flex-col-reverse gap-y-[15px] py-[15px]">
      {
        data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((item: MessageWithMemberWithProfile) => (
              <GroupChatMessage key={item.id} item={item} currentMember={currentMember} groupId={groupId}/>
            ))}
          </Fragment>
        ))
      }
    </div>

      
    </div>
  )
}