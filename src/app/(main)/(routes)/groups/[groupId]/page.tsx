import { redirect } from "next/navigation";
import { FC } from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/current-profile';
import { GroupChatHeader } from "@/components/groups/group-chat-header";
import { GroupChatMessages } from "@/components/groups/group-chat-messages";
import { ChatInput } from "@/components/chats/chat-input";
import { GroupChat } from "@/components/groups/group-chat";

interface GroupIdProps {
  params: { groupId: string }
}

const GroupIdPage: FC<GroupIdProps> = async ({ params }) => {

  const profile = await currentProfile();

  if(!profile){
    return redirectToSignIn();
  }

  const group = await db.group.findUnique({
    where: {
      id: params.groupId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
  });

  if(!group) {
    return redirect('/groups');
  }

  const members = await db.member.findMany({
    where: {
      groupId: group.id,
    },
    include: {
      profile: true,
    }
  });

  const currentMember = members.find((member) => member.profileId === profile.id);

  return (
    <div className="h-full">
      <GroupChat currentMember={currentMember!} group={group} members={members}/>
    </div>
  );
}
 
export default GroupIdPage;