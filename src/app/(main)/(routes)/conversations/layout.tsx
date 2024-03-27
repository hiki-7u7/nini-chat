import { FC, ReactNode } from 'react';
import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/current-profile';
import { ConversationsSidebar } from '@/components/conversations/conversations-sidebar';
import { db } from '@/lib/db';


interface ConversationsProps {
  children: ReactNode
}

const ConversationsLayout: FC<ConversationsProps> = async ({ children }) => {

  const profile = await currentProfile();

  if(!profile) {
    return redirectToSignIn();
  }

  const requestsReceived = await db.friendRequest.findMany({
    where:{
      receiverId: profile.id,
      status: "PENDING",
    },
    include: {
      receiver: true,
      sender: true,
    }
  });

  const user = await db.profile.findUnique({
    where: { id: profile.id },
    include: {
      conversationsInitiated: {
        include: { profileTwo: true }
      },
      conversationsReceived: {
        include: { profileOne: true }
      },
    }
  })

  const conversations = [
    ...user!.conversationsInitiated.map(conversation => conversation.profileTwo),
    ...user!.conversationsReceived.map(conversation => conversation.profileOne)
  ];

  return (
    <>
      <ConversationsSidebar friendRequests={requestsReceived} conversations={conversations}/>
      <div className="md:pl-[280px] h-full">
        {children}
      </div>
    </>
  );
}

export default ConversationsLayout;