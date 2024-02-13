import { redirect } from "next/navigation";
import { FC } from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { GroupChat } from "@/components/groups/group-chat";
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

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
    return redirect('/');
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
    <div className="bg-[#2B2B2B] h-full">
      <GroupChat group={group} members={members} currentMember={currentMember!}/>
    </div>
  );
}
 
export default GroupIdPage;