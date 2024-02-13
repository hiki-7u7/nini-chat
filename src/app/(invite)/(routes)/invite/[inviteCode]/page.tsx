import { FC } from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { JoinGroup } from "@/components/invite/join-group";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodeProps {
  params: { inviteCode: string }
}

const InviteCodePage: FC<InviteCodeProps> = async ({ params }) => {

  const profile = await currentProfile();

  if(!profile){
    return redirectToSignIn();
  }

  if(!params.inviteCode) {
		return redirect("/");
	}

  const group = await db.group.findFirst({
    where: {
      inviteCode: params.inviteCode
    }
  });

  if(!group){
    return (
      <div className="bg-[#212121] h-full flex items-center justify-center">
        <p className="text-white">El codigo de invitacion es invalido</p>
      </div>
    )
  }

  const isAlreadyMember = await db.group.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if(isAlreadyMember){
    return redirect('/')
  }

  return (
    <div className="bg-[#212121] h-full flex items-center justify-center">
      <JoinGroup group={group} inviteCode={params.inviteCode}/>
    </div>
  );
}
 
export default InviteCodePage;