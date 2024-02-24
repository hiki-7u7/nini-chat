"use client";

import { FC } from "react";

import { Group } from "@prisma/client";
import { MemberWithProfile } from "@/types/group";
import { GroupChatHeader } from "./group-chat-header";
import { GroupChatInput } from "./group-chat-input";
import { GroupMessages } from "./group-messages";

interface GroupChatProps {
  group: Group,
  members: MemberWithProfile[],
  currentMember: MemberWithProfile,
}

export const GroupChat: FC<GroupChatProps> = ({ group, members, currentMember }) => {

  return (
    <div className="h-full relative flex flex-col">
      <div className="relative">
        <GroupChatHeader group={group} members={members} currentMember={currentMember}/>
      </div>
      <GroupMessages groupId={group.id} currentMember={currentMember}/>
      <GroupChatInput group={group} />
    </div>
  )
}