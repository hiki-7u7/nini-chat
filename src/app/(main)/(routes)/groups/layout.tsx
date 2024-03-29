import { FC, ReactNode } from 'react';
import { redirectToSignIn } from '@clerk/nextjs';

import { GroupsSidebar } from '@/components/groups/groups-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';


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
    },
    orderBy: {
      createdAt: "asc"
    }
  })

  return (
    <>
      <GroupsSidebar groups={groups}/>
      <div className="md:pl-[280px] h-full">
        {children}
      </div>
    </>
  );
}
 
export default GroupsLayout;