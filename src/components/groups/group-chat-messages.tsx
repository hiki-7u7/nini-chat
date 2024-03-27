"use client";

import { ElementRef, FC, Fragment, useEffect, useRef, useState } from "react";

import { useChatQuery } from "@/hooks/use-chat-query";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/types/group";
import { Icons } from "@/components/icons";
import { GroupChatMessage } from "./group-chat-message";
import { Profile } from "@prisma/client";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface GroupChatMessagesProps {
  groupId: string,
  currentMember: MemberWithProfile
}

export const GroupChatMessages: FC<GroupChatMessagesProps> = ({ groupId, currentMember }) => {

  const [friends, setFriends] = useState<Profile[]>([]);
  const [isItemEditingId, serIsItemEditingId] = useState("");

  const chatRef = useRef<ElementRef<"div">>(null);
	const bottomRef = useRef<ElementRef<"div">>(null);

  const queryKey = `chat:${groupId}`
	const addKey = `group:${groupId}:messages`
	const updateKey = `group:${groupId}:messages:update`

  useChatSocket({
    addKey,
    queryKey,
    updateKey
  });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useChatQuery({
    apiUrl: '/api/messages',
    query: `groupId=${groupId}`,
    queryKey: `chat:${groupId}`,
  });
  useChatScroll({
    bottomRef,
    chatRef,
    count: data?.pages?.[0]?.items?.length ?? 0
  });

  useEffect(() => {    
    const url = `/api/profiles/${currentMember.profileId}/conversations`;
    axios.get<Profile[]>(url)
    .then(({data}) => setFriends(data));
  },[])

  useEffect(() => {

    pusherClient.subscribe(toPusherKey(`profile:${currentMember.profile.userId}:new_friend`))

    const newFriendHandler = ( newFriend: Profile ) => {
      setFriends([...friends, newFriend]);
    };

    pusherClient.bind('new_friend', newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`profile:${currentMember.profile.userId}:new_friend`))
      pusherClient.unbind('new_friend', newFriendHandler);
    };

  }, [])

  useEffect(() => {
    
    pusherClient.subscribe(toPusherKey(`profile:${currentMember.profile.userId}:remove_friend`))

    
    const removeFriendHandler = ( { friendIdToDelete }: { friendIdToDelete: string } ) => {
      setFriends(friends.filter(fr => fr.id !== friendIdToDelete));
    };

    pusherClient.bind('remove_friend', removeFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`profile:${currentMember.profile.userId}:remove_friend`))
      pusherClient.unbind('remove_friend', removeFriendHandler);
    };

  }, [])

  const handleChangeItemEditingId = ( itemId: string ) => {
    serIsItemEditingId(itemId);
  };

  if(status === "pending"){
    return (
      <div className="flex flex-1 justify-center items-center bg-[#2B2B2B]">
        <div className="flex flex-col items-center gap-y-3">
          <Icons.Loader2 className="text-white animate-spin"/>
          <p className="text-white text-sm">Cargando mensajes</p>
        </div>
      </div>
    )
  }

  if(status === "error"){
    return (
      <div className="flex flex-1 justify-center items-center bg-[#2B2B2B]">
        <div className="flex flex-col items-center gap-y-3">
          <Icons.ServerCrash className="text-white"/>
          <p className="text-white text-sm">Hubo un error</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={chatRef}
      className="
        relative
        bg-[#2B2B2B]
        -z-0
        flex-1 
        flex 
        flex-col 
        overflow-y-auto
        scrollbar-with
        scrollbar-thumb
        scrollbar-track
      "
    >

      <div className="flex flex-col-reverse pb-[15px]">
        {
          data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.items.map((item: MessageWithMemberWithProfile, i:number) => {
                
                const hasNextMessageFromSameUser = 
                  item.memberId === page.items[i + 1]?.memberId;
                
                const isFriend = friends.find(friend => friend.id === item.member.profileId);
              
                const prevItemDateTime =  new Date(page.items[i + 1]?.createdAt).getTime();
                const currentItemDateTime = new Date(item.createdAt).getTime();

                const isNotMessageRecent = (currentItemDateTime - prevItemDateTime) > 300000;

                const isNotMessageRecentFromSameUser = hasNextMessageFromSameUser && isNotMessageRecent

                return (
                  <GroupChatMessage
                    handleChangeItemEditingId={handleChangeItemEditingId}
                    isEditingId={isItemEditingId}
                    isFriend={!!isFriend}
                    key={item.id}
                    item={item}
                    currentMember={currentMember} 
                    groupId={groupId}
                    hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                    isNotMessageRecentFromSameUser={isNotMessageRecentFromSameUser}
                  />
                )
              })}
            </Fragment>
          ))
        }
      </div>
      <div ref={bottomRef}/>
    </div>
  )
}