"use client";

import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";

interface ConversationListProps {
  conversations: Profile[]
}

export const ConversationList: FC<ConversationListProps> = ({ conversations }) => {

  const router = useRouter();
  const { conversationId } = useParams();

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
      {conversations.map((conversation) => (
         <div
         onClick={() => router.push(`/conversations/${conversation.id}`)}
         key={conversation.id}
         className={cn(`
         hover:bg-[#333333]
           cursor-pointer
           mx-[10px]
           rounded-[5px]
           h-[50px]
           flex
           items-center
           justify-between
           px-[10px]`,
           conversation.id === conversationId ? "bg-[#333333]" : null
         )}
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
               src={conversation.imageUrl}
               fill
               alt="group image"
               className="rounded-full"
             />
           </div>
           <p className="text-white text-sm font-medium">
             {conversation.name.length > 13
               ? conversation.name.substring(0,13) + '...'
               : conversation.name
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
  )
}