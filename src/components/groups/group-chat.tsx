"use client";

import { Group } from "@prisma/client";
import { FC } from "react";
import { GroupChatHeader } from "./group-chat-header";
import { MemberWithProfile } from "@/types/group";

interface GroupChatProps {
  group: Group,
  members: MemberWithProfile[],
  currentMember: MemberWithProfile,
}

export const GroupChat: FC<GroupChatProps> = ({ group, members, currentMember }) => {

  return (
    <div className="h-full relative">
      <div className="h-[70px] relative">
        <GroupChatHeader group={group} members={members} currentMember={currentMember}/>
      </div>
    </div>
  )
}