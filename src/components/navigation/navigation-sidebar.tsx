'use client';

import { FC, useEffect } from "react";
import { Icon, Icons } from "@/components/icons";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toPusherKey } from "@/lib/utils";

interface NavigationSidebarProps {
  
}

interface SidebarOption {
    id: number,
    name: string,
    Icon: Icon,
    href: string,
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Conversations',
    Icon: 'User',
    href: '/conversations',
  },
  {
    id: 2,
    name: 'Groups',
    href: '/groups',
    Icon: 'Users',
  },
]

const NavigationSidebar: FC<NavigationSidebarProps> = () => {

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {


    if(!user) return;

    pusherClient.subscribe(toPusherKey(`profile:${user?.id}:new_friend`))

    const newFriendHandler = () => {
      router.refresh();
    };

    pusherClient.bind('new_friend', newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`profile:${user?.id}:new_friend`))
      pusherClient.unbind('new_friend', newFriendHandler);
    };

  }, [user, router])

  useEffect(() => {

    if(!user) return;
    
    pusherClient.subscribe(toPusherKey(`profile:${user?.id}:remove_friend`))
    
    const removeFriendHandler = () => {
      router.refresh();
    };

    pusherClient.bind('remove_friend', removeFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`profile:${user?.id}:remove_friend`))
      pusherClient.unbind('remove_friend', removeFriendHandler);
    };

  }, [user, router])

  return (
    <div
      className="
        h-full
        bg-[#212121]
        flex
        flex-col
        gap-y-3
        items-center
        py-[10px]
      "
    >
      {sidebarOptions.map( (option) => {

        const { id, name, href } = option;
        const Icon = Icons[option.Icon];

        return (
          <Link
            key={id} 
            href={href}
            className="
            bg-[#292929]
              cursor-pointer
              h-[50px]
              w-[50px]
              flex
              items-center
              justify-center
              rounded-md
            "
          >
            <Icon className="text-white"/>
          </Link>
        )
      })}
    </div>
  );
}
 
export default NavigationSidebar;