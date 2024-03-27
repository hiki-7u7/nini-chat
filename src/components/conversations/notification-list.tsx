"use client";

import { FriendRequestWithSenderAndReceiverProfile } from "@/types/conversations";
import Image from "next/image";
import { FC, useState } from "react";
import { Icons } from "../icons";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NotificationListProps {
  friendRequests: FriendRequestWithSenderAndReceiverProfile[]
}

export const NotificationList: FC<NotificationListProps> = ({ friendRequests }) => {

  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();

  const handleAcceptRequest = async (senderId: string, friendRequestId: string) => {
    
    const url = `/api/conversations`;

    setIsloading(true);
    try {
      await axios.post(url, { senderId, friendRequestId });
      router.refresh();
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false);
    }
  }

  const handleRejectRequest = async (friendRequestId: string) => {
    const url = `/api/friend-requests/${friendRequestId}`;

    setIsloading(true);
    try {
      await axios.delete(url);
      router.refresh();
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div className="p-[10px] flex flex-col gap-y-[5px]">
      {friendRequests.map((fr) => (
        <div 
          key={fr.id} 
          className="
            hover:bg-[#333333]
            cursor-pointer
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
                src={fr.sender.imageUrl}
                fill
                alt="group image"
                className="rounded-full"
              />
            </div>
            <p className="text-white text-sm font-medium">
              {fr.sender.name.length > 13
                ? fr.sender.name.substring(0,13) + '...'
                : fr.sender.name
              }
            </p>
          </div>

          <div className="flex gap-x-[5px]">
            <div
              onClick={() => handleAcceptRequest(fr.senderId, fr.id)} 
              className={cn(
                `h-[25px] 
                w-[25px] 
                bg-white 
                rounded-full 
                flex 
                items-center 
                justify-center
                hover:bg-[hsl(0,0%,80%)]`,
                isLoading ? 'bg-[hsl(0,0%,80%)]' : null
              )}
            >
              <Icons.Check className="h-[17px] w-[17px] text-black"/>
            </div>
            <div
              onClick={() => handleRejectRequest(fr.id)} 
              className={cn(
                `h-[25px] 
                w-[25px] 
                bg-red-500
                rounded-full 
                flex 
                items-center 
                justify-center
                hover:bg-red-400`,
                isLoading ? 'bg-red-400' : null
              )}
            >
              <Icons.X className="h-[17px] w-[17px] text-white"/>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}