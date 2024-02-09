import { FC, ReactNode } from "react";
import { redirectToSignIn } from "@clerk/nextjs";


import { Sidebar } from "@/components/side-bar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


interface GroupsLayoutProps {
  children: ReactNode
}

const GroupsLayout: FC<GroupsLayoutProps> = async ({ children }) => {

  const profile = await currentProfile();

  if(!profile) {
    return redirectToSignIn();
  }

  const groups = await db.group.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      messages: true
    }
  })

  return (
    <>
      <Sidebar page="groups" chats={groups}/>
      <div className="md:pl-[250px] h-full">
        {children}
      </div>
    </>
  );
}
 
export default GroupsLayout;