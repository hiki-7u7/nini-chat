"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

import { GroupWithMessages } from "@/types/group";
import { Message } from "@prisma/client";

interface GroupListProps {
  groups: GroupWithMessages[]
}

export const GroupList: FC<GroupListProps> = ({ groups }) => {

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  const router = useRouter();

  const handleNavigate = (id: string) => {
    router.push(`/groups/${id}`);
  };

  return (
    <div
      className="
        flex
        flex-col
        flex-1
        mt-[10px]
        gap-y-[5px]
      "
    >
      {groups.map((group) => (
        <div
          onClick={() => handleNavigate(group.id)}
          key={group.id}
          className="
          hover:bg-[#333333]
            cursor-pointer
            mx-[10px]
            rounded-[5px]
            h-[50px]
            flex
            items-center
            justify-between
            px-[10px]
          "
        >
          <div className="flex gap-x-[10px] items-center">
            <div
              className="
                h-[35px]
                w-[35px]
                relative
                rounded-full
              "
            >
              <Image
                src={group.imageUrl}
                fill
                alt="group image"
                className="rounded-full"
              />
            </div>
            <p className="text-white text-sm font-medium">
              {group.name.length > 10
                ? group.name.substring(0,10) + '...'
                : group.name
              }
            </p>
          </div>

          <div
            className="
            bg-red-500
            h-[22px]
            w-[22px]
            rounded-full
            flex
            items-center
            justify-center
          "
          >
            <p className="text-white text-xs font-bold">1</p>
          </div>
        </div>
      ))}
    </div>
  );
};
