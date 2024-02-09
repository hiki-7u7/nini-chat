'use client';

import { FC } from "react";
import { Icon, Icons } from "@/components/icons";
import Link from "next/link";

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
  {
    id: 3,
    name: 'Favorites',
    href: '/favorites',
    Icon: 'Heart',
  },
  {
    id: 4,
    name: 'Hiddens',
    href: '/hiddens',
    Icon: 'EyeOff',
  },
]

const NavigationSidebar: FC<NavigationSidebarProps> = () => {
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