"use client";

import { FC, useEffect, useState } from "react";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserButton, useUser } from "@clerk/nextjs";
import { useModal } from "@/hooks/use-modal-store";
import { FriendRequestWithSenderAndReceiverProfile } from "@/types/conversations";
import { NotificationList } from "./notification-list";
import { ConversationList } from "./conversation-list";
import { Profile } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ConversationsSidebarProps {
  friendRequests: FriendRequestWithSenderAndReceiverProfile[],
  conversations: Profile[],
}

export const ConversationsSidebar: FC<ConversationsSidebarProps> = ({ friendRequests, conversations }) => {

  const [searchValue, setSearchValue] = useState<string>('');
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestWithSenderAndReceiverProfile[]>([]);
  const [sidebarVariant, setSidebarVariant] = useState<'conversations' | 'notifications'>('conversations');
  
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIncomingRequests(friendRequests)
  }, [friendRequests])

  useEffect(() => {

    if(!user) return;

    pusherClient.subscribe(toPusherKey(`profile:${user?.id}:friend_request`))

    const incomingRequestsHandler = ( friendRequests: FriendRequestWithSenderAndReceiverProfile ) => {
      setIncomingRequests([...incomingRequests, friendRequests]);
    };

    pusherClient.bind('friend_request', incomingRequestsHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`profile:${user?.id}:friend_request`))
      pusherClient.unbind('friend_request', incomingRequestsHandler)
    }

  }, [incomingRequests,user, router]);

  

  const { onOpen } = useModal();

  const onChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div
      className="
        hidden
        md:flex
        w-[280px]
        fixed
        bg-[#2B2B2B]
        inset-y-0
        flex-col
        border-r-2
        border-[#212121]
      "
    >
      <Search page="conversations" onChange={onChange} value={searchValue}/>
      <div className="p-[10px] border-b-2 border-[#212121] bg-[#292929] flex gap-x-[10px]">
        <Button
          className="flex-1 justify-center"
          onClick={() => onOpen('friendRequest')}
          icon={<Icons.UserPlus className="h-[20px] w-[20px]" />}
        />
        <Button
          className="flex-1 justify-center"
          onClick={() => setSidebarVariant((prev) => prev === "conversations" ? "notifications" : "conversations")}
          icon={sidebarVariant === "conversations"
            ? (
              <div className="relative">
                <Icons.Bell className="h-[20px] w-[20px]" />
                {incomingRequests.length > 0 && (
                  <div className="absolute h-[16px] w-[16px] bg-red-500 -top-[5px] -right-[6px] rounded-full flex justify-center items-center">
                    <p className="text-white text-[11px] font-medium">{incomingRequests.length}</p>
                  </div>
                )}
              </div>
            )
            : <Icons.MessageSquareText className="h-[20px] w-[20px]" />
          }
        />
      </div>

      <div className="flex-1">
        {(sidebarVariant === "notifications")
          ? <NotificationList friendRequests={incomingRequests}/>
          : <ConversationList conversations={conversations.filter((conversation) => {
            return conversation.name.toLowerCase().includes(searchValue.toLowerCase()) 
          })}/>
        }
      </div>

      <div
        className="
					h-[70px] 
					border-t-2 
					border-[#212121] 
					flex 
					justify-between 
					items-center
					px-[10px]
          bg-[#292929]
				"
        onClick={() => {}}
      >
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
          afterSignOutUrl="/"
        />
        <div className="p-3 hover:bg-[#333333] rounded-full cursor-pointer">
          <Icons.Settings className="text-white h-[22px] w-[22px]" />
        </div>
      </div>
    </div>
  )
}