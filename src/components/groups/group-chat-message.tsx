"use client";

import { FC, KeyboardEvent, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { cn } from "@/lib/utils";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/types/group";
import { Icons } from "@/components/icons";
import { formatMessageDate, formatTime } from "@/helpers/format-message-date";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

interface GroupChatMessageProps {
  item: MessageWithMemberWithProfile,
  currentMember: MemberWithProfile,
  groupId: string,
  hasNextMessageFromSameUser: boolean,
  isNotMessageRecentFromSameUser: boolean,
  isFriend: boolean,
  isEditingId: string
  handleChangeItemEditingId: (itemId: string) => void
}

export const GroupChatMessage: FC<GroupChatMessageProps> = ({ 
  item, 
  currentMember, 
  groupId,
  hasNextMessageFromSameUser,
  isNotMessageRecentFromSameUser,
  isFriend,
  isEditingId,
  handleChangeItemEditingId,
}) => {

  
  const [values, setvalues] = useState({
    content: '',
  });

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();
  const { onOpen } = useModal();

  const isAdmin = currentMember.role === "ADMIN";
  const isOwner = currentMember.id === item.member.id;

  useEffect(() => {
    setvalues({ content: item.content });
  }, [item])

  const handleDelete = async () => {

    if(isDeleting) return;

    const url = `/api/messages/${item.id}?groupId=${groupId}`;
    
    setIsDeleting(true);
    try {
      await axios.delete(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {

    if(!values.content.length) return; 

    const url = `/api/messages/${item.id}?groupId=${groupId}`;
    
    setIsEditing(true);
    try {
      await axios.patch(url, values);
      setIsEditing(false);
      handleChangeItemEditingId("")
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }

  };

  const handleDeleteFile = async () => {

    if(isDeletingFile) return;

    const url = `/api/messages/${item.id}?groupId=${groupId}`;
    setIsDeletingFile(true);

    try {
      const { data } = await axios.patch(url, { fileUrl: null });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeletingFile(false);
    }

  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      return handleEdit();
    }

    if(e.key === "Escape" ) {
      handleChangeItemEditingId("");
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
        hover:bg-[hsl(0,0%,15%)]`,
        isEditingId === item.id ? "bg-[#242424]" : null,
        (hasNextMessageFromSameUser && !isNotMessageRecentFromSameUser) ? 'mt-0 pl-[70px] py-[2px]' : null,
    )}>

      {(!hasNextMessageFromSameUser || isNotMessageRecentFromSameUser) && (
          <div className={cn(
            `relative h-[40px] w-[40px] rounded-full`,
            (isEditingId === item.id || item.fileUrl) ? "mt-[2px]" : "my-auto" 
          )}>
            <Image 
              fill
              src={item.member.profile.imageUrl}
              alt="member image"
              className="rounded-full"
            />
          </div>
        )
      }
      
      {(hasNextMessageFromSameUser && !isNotMessageRecentFromSameUser) && (
        <p 
          className={cn(`
            hidden 
            group-hover:flex 
            absolute 
            left-[15px] 
            text-[#808080] 
            text-[11px]
            items-center
            h-full`, 
            isEditingId === item.id ? "-mt-[29px]" : null, 
          )}
        >
          {formatTime(new Date(item.createdAt))}
        </p>
      )}

      <div className="flex-1">
        {(!hasNextMessageFromSameUser || isNotMessageRecentFromSameUser) && (
          <div className="flex gap-x-[10px] items-center">
            <p
              onClick={() => {
                if(item.memberId === currentMember.id) return;
                isFriend ? router.push(`/conversations/${item.member.profileId}`) : onOpen('friendRequest', { conversationProfile: item.member.profile }) 
              }}
              className="
                text-white 
                text-sm 
                font-medium 
                cursor-pointer 
                hover:underline
              "
            >
              {item.member.profile.name}
            </p>
            
            <span className="text-[#808080] text-xs">{formatMessageDate(item.createdAt)}</span>
          </div>
        )}
        
        { isEditingId === item.id ? (
          <div className="my-[10px]">
            <div className="w-full relative">
              <input
                autoFocus
                className="
                  text-sm
                  focus:outline-none
                  w-full 
                  pl-[10px] 
                  pr-[35px] 
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
              {
                isEditing
                  ? <Icons.Loader2 className="text-white h-[15px] w-[15px] animate-spin absolute right-[10px] top-0 bottom-0 my-auto"/>
                  : <Icons.Pencil className="text-white h-[15px] w-[15px] absolute right-[10px] top-0 bottom-0 my-auto"/>
              }
            </div>
            <p className="text-xs mt-[10px] text-[#808080]">
              <span onClick={() => handleChangeItemEditingId("") } className="text-white underline cursor-pointer mr-[4px]">Esc</span> 
              para salir y 
              <span onClick={handleEdit} className="text-white underline cursor-pointer mx-[4px]">Enter</span> 
              para editar
            </p>
            
          </div>
        ) : (
          <>
            {item.content.length > 0 && (
              <p className={cn(
                "text-white text-sm mt-[5px] message-break-word",
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
            { (item.content.length > 0 && (isAdmin || isOwner)) && (
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
                {isDeletingFile
                  ? <Icons.Loader2 className="text-white h-[18px] w-[18px] animate-spin"/>
                  : <Icons.Trash className="text-white h-[18px] w-[18px]"/>
                }
              
              </div>
            ) }
          </div>
        )}
      </div>
      
      {!item.deleted && (isEditingId !== item.id) && (isAdmin || isOwner) && (
        <div 
          className="
            absolute 
            -top-[15px] 
            right-[15px] 
            gap-x-[5px] 
            hidden 
            group-hover:flex
            z-30
          "
        >
          {
            isOwner && !item.fileUrl && (
              <div
                onClick={() => handleChangeItemEditingId(item.id)}
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
                isEditing
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
              isDeleting
              ? <Icons.Loader2 className="text-white h-[15px] w-[15px] animate-spin"/>
              : <Icons.Trash className="text-white h-[15px] w-[15px]"/>
            }
            
          </div>
        </div>
      )}


    </div>
  )
}