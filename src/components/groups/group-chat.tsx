"use client";

import { FC, useEffect, useState } from "react";

import { MemberWithProfile } from "@/types/group";
import { Group } from "@prisma/client";

import { GroupChatHeader } from "./group-chat-header";
import { GroupChatMessages } from "./group-chat-messages";
import { ChatInput } from "../chats/chat-input";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';


interface GroupChatProps {
  group: Group,
  members: MemberWithProfile[],
  currentMember: MemberWithProfile,
}

export const GroupChat: FC<GroupChatProps> = ({ group, currentMember, members }) => {

  const router = useRouter();

  useEffect(() => {

    if(!group) return;

    pusherClient.subscribe(toPusherKey(`group:${group.id}:ban_member`));

    const bannedMemberHandler = ( { bannedMemberId }: { bannedMemberId: string } ) => {
      if(currentMember.id !== bannedMemberId) return;
      
      toast('Haz sido baneado del grupo')

      router.push('/groups')
      router.refresh();
    };

    pusherClient.bind('ban_member', bannedMemberHandler );

    return () => {
      pusherClient.unsubscribe(toPusherKey(`group:${group?.id}:ban_member`));
      pusherClient.unbind('ban_member', bannedMemberHandler);
    }

  }, [group, currentMember])

  return (
    <div className="h-full relative flex flex-col">
      <div className="relative">
        <GroupChatHeader group={group} members={members} currentMember={currentMember!}/>
      </div>
      <GroupChatMessages groupId={group.id} currentMember={currentMember!}/>
      <div className="relative bg-[#292929]">
        <ChatInput
          apiUrl="/api/messages"
          query={`groupId=${group.id}`}
        />
      </div>
    </div>
  )
}