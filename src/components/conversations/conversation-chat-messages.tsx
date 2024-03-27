"use client";

import { FC, Fragment } from "react";

import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberWithProfile } from "@/types/group";
import { Icons } from "@/components/icons";
import { ConversationChatMessage } from "./conversation-chat-message";
import { Profile } from "@prisma/client";
import { DirectMessageWithProfile } from "@/types/conversations";

interface ConversationChatMessagesProps {
  conversationId: string,
  currentProfile: Profile
}

export const ConversationChatMessages: FC<ConversationChatMessagesProps> = ({ conversationId, currentProfile }) => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useChatQuery({
    apiUrl: '/api/direct-messages',
    query: `conversationId=${conversationId}`,
    queryKey: `chat:${conversationId}`,
  });

  

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

    <div className="flex flex-col-reverse pb-[15px]">
      {
        data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((item: DirectMessageWithProfile, i:number) => {
              
              const hasNextMessageFromSameUser = item.profileId === page.items[i + 1]?.profileId;
              
             
              const prevItemDateTime =  new Date(page.items[i + 1]?.createdAt).getTime();
              const currentItemDateTime = new Date(item.createdAt).getTime();

              const isNotMessageRecent = (currentItemDateTime - prevItemDateTime) > 300000;

              const isNotMessageRecentFromSameUser = hasNextMessageFromSameUser && isNotMessageRecent

              return (
                <ConversationChatMessage
                  key={item.id}
                  item={item}
                  currentProfile={currentProfile}
                  conversationId={conversationId}
                  hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                  isNotMessageRecentFromSameUser={isNotMessageRecentFromSameUser}
                />
              )
            })}
          </Fragment>
        ))
      }
    </div>

      
    </div>
  )
}