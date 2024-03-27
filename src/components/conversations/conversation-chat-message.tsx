"use client";

import { FC, KeyboardEvent, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { cn } from "@/lib/utils";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/types/group";
import { Icons } from "@/components/icons";
import { formatMessageDate, formatTime } from "@/helpers/format-message-date";
import { useRouter } from "next/navigation";
import { DirectMessageWithProfile } from "@/types/conversations";
import { Profile } from "@prisma/client";

interface ConversationChatMessageProps {
  item: DirectMessageWithProfile,
  currentProfile: Profile,
  conversationId: string,
  hasNextMessageFromSameUser: boolean,
  isNotMessageRecentFromSameUser: boolean,
}

export const ConversationChatMessage: FC<ConversationChatMessageProps> = ({ 
  item, 
  currentProfile,
  conversationId,
  hasNextMessageFromSameUser,
  isNotMessageRecentFromSameUser
}) => {

  
  const [values, setvalues] = useState({
    content: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();

  const isOwner = currentProfile.id === item.profileId;

  useEffect(() => {
    setvalues({ content: item.content });
  }, [item])

  const handleDelete = async () => {

    if(isLoading) return;

    const url = `/api/direct-messages/${item.id}?conversationId=${conversationId}`;
    
    setIsLoading(true);
    try {
      await axios.delete(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {

    if(!values.content.length) {
      return;
    };

    const url = `/api/direct-messages/${item.id}?conversationId=${conversationId}`;
    setIsLoading(true);

    try {
      const { data } = await axios.patch(url, values);
      setvalues({ content: data.content })
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  };

  const handleDeleteFile = async () => {

    if(isLoading) return;

    const url = `/api/direct-messages/${item.id}?conversationId=${conversationId}`;
    setIsLoading(true);

    try {
      const { data } = await axios.patch(url, { fileUrl: null });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      return handleEdit();
    }

    if(e.key === "Escape" ) {
      setIsEditing(false);
      setvalues({ content: item.content });
      return;
    }
  }

  return (
    <div className={cn(`
        relative
        flex
        gap-x-[15px]
        py-[7px]
        px-[15px]
        group
        mt-[15px]
        hover:bg-[#242424]`,
        isEditing ? "bg-[#242424]" : null,
        (hasNextMessageFromSameUser && !isNotMessageRecentFromSameUser) ? 'mt-0 pl-[70px] py-[2px]' : null,
    )}>

      {(!hasNextMessageFromSameUser || isNotMessageRecentFromSameUser) && (
          <div className={cn(
            `relative h-[40px] w-[40px] rounded-full`,
            (isEditing || item.fileUrl) ? "mt-[2px]" : "my-auto" 
          )}>
            <Image 
              fill
              src={item.profile.imageUrl}
              alt="member image"
              className="rounded-full"
            />
          </div>
        )
      }
      
      {(hasNextMessageFromSameUser && !isNotMessageRecentFromSameUser) && (
        <p 
          className="
            hidden 
            group-hover:flex 
            absolute 
            left-[15px] 
            text-[#808080] 
            text-[11px]
            items-center
            h-full
          "
        >
          {formatTime(new Date(item.createdAt))}
        </p>
      )}

      <div className="flex-1">
        {(!hasNextMessageFromSameUser || isNotMessageRecentFromSameUser) && (
          <div className="flex gap-x-[10px] items-center">
            <p
              className="
                text-white 
                text-sm 
                font-medium 
                cursor-pointer 
                hover:underline
              "
            >
              {item.profile.name}
            </p>
            <span className="text-[#808080] text-xs">{formatMessageDate(item.createdAt)}</span>
          </div>
        )}
        { isEditing ? (
          <div className="mt-[5px]">
            <input
              autoFocus
              className="
                text-sm
                focus:outline-none
                w-full 
                px-[10px] 
                rounded-[5px]
                h-[40px] 
                bg-[#404040]
                text-white
              "
              type="text" 
              value={values.content} 
              onChange={(e) => setvalues({ content: e.target.value })}
              onKeyUp={handleKeyUp}
            />
            <p className="text-xs mt-[5px] text-[#808080]">
              <span onClick={() => setIsEditing(false) } className="text-white underline cursor-pointer mr-[4px]">Esc</span> 
              para salir y 
              <span onClick={handleEdit} className="text-white underline cursor-pointer mx-[4px]">Enter</span> 
              para editar
            </p>
          </div>
        ) : (
          <>
            {item.content.length > 0 && (
              <p className={cn(
                "text-white text-sm mt-[5px]",
                item.deleted ? "text-[#808080] text-xs" : null
              )}>
                {item.content} { !item.deleted && (item.createdAt !== item.updatedAt) && <span className="text-xs text-[#808080]">(editado)</span> }
              </p> 
            )}
          </>
        )}
        {item.fileUrl && (
          <div className="relative h-[200px] w-[200px] rounded-[5px] mt-[5px]">
            <Image 
              fill
              src={item.fileUrl!}
              alt="file"
              className="rounded-[5px]"
            />
            { (item.content.length > 0 && isOwner) && (
              <div
                onClick={handleDeleteFile}
                className="
                  h-[30px] 
                  w-[30px] 
                  bg-red-500 
                  rounded-[5px] 
                  absolute 
                  top-[5px] 
                  right-[5px] 
                  flex 
                  items-center 
                  justify-center
                  cursor-pointer
                "
              >
                {isLoading
                  ? <Icons.Loader2 className="text-white h-[18px] w-[18px] animate-spin"/>
                  : <Icons.Trash className="text-white h-[18px] w-[18px]"/>
                }
              
              </div>
            ) }
          </div>
        )}
      </div>
      
      {!item.deleted && isOwner && (
        <div 
          className="
            absolute 
            -top-[15px] 
            right-[15px] 
            gap-x-[5px] 
            hidden 
            group-hover:flex
          "
        >
          {
            isOwner && !item.fileUrl && (
              <div
                onClick={() => setIsEditing(true)}
                className="
                  cursor-pointer
                  w-[25px] 
                  h-[25px] 
                  bg-[#404040] 
                  rounded-[5px] 
                  flex 
                  justify-center 
                  items-center
                "
              >
              {
                isLoading
                  ? <Icons.Loader2 className="text-white h-[15px] w-[15px] animate-spin"/>
                  : <Icons.Pencil className="text-white h-[15px] w-[15px]"/>
              }
              </div>
            )
          }
          <div
            onClick={handleDelete}
            className="
              cursor-pointer
              w-[25px] 
              h-[25px] 
              bg-[#404040] 
              rounded-[5px] 
              flex 
              justify-center 
              items-center
            "
          >
            {
              isLoading
              ? <Icons.Loader2 className="text-white h-[15px] w-[15px] animate-spin"/>
              : <Icons.Trash className="text-white h-[15px] w-[15px]"/>
            }
            
          </div>
        </div>
      )}


    </div>
  )
}