"use client";

import { ElementRef, FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { cn } from "@/lib/utils";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/types/group";
import { Icons } from "@/components/icons";

interface GroupChatMessageProps {
  item: MessageWithMemberWithProfile,
  currentMember: MemberWithProfile,
  groupId: string,
}

export const GroupChatMessage: FC<GroupChatMessageProps> = ({ 
  item, 
  currentMember, 
  groupId 
}) => {

  
  const [values, setvalues] = useState({
    content: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isAdmin = currentMember.role === "ADMIN";
  const isOwner = currentMember.id === item.member.id;

  useEffect(() => {
    setvalues({ content: item.content });
  }, [item])

  const handleDelete = async () => {

    if(isLoading) return;

    const url = `/api/messages/${item.id}?groupId=${groupId}`;
    
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

    const url = `/api/messages/${item.id}?groupId=${groupId}`;
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
        gap-x-[10px]
        py-[9px]
        px-[10px]
        group
        hover:bg-[#242424]`,
        isEditing ? "bg-[#242424]" : null
    )}>

      <div className={cn(
        `relative h-[40px] w-[40px] rounded-full`,
        isEditing ? "mt-[2px]" : "my-auto" 
      )}>
        <Image 
          fill
          src={item.member.profile.imageUrl}
          alt="member image"
          className="rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="flex gap-x-[10px] items-center">
          <p className="text-white text-sm font-medium">{item.member.profile.name}</p>
          <span className="text-[#808080] text-xs">hace 1 hora</span>
        </div>
        { isEditing ? (
          <div className="mt-[4px]">
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
            <p className="text-xs mt-[4px] text-[#808080]">
              <span onClick={() => setIsEditing(false) } className="text-white underline cursor-pointer mr-[4px]">Esc</span> 
              para salir y 
              <span onClick={handleEdit} className="text-white underline cursor-pointer mx-[4px]">Enter</span> 
              para editar
            </p>
          </div>
        ) : (
          <p className={cn(
            "text-white text-sm mt-[4px]",
            item.deleted ? "text-[#808080] text-xs" : null
          )}>
            {item.content} { !item.deleted && (item.createdAt !== item.updatedAt) && <span className="text-xs text-[#808080]">(editado)</span> }
          </p> 
        )}
      </div>
      
      {!item.deleted && (isAdmin || isOwner) && (
        <div 
          className="
            absolute 
            -top-[15px] 
            right-[10px] 
            gap-x-[5px] 
            hidden 
            group-hover:flex
          "
        >
          {
            isOwner && (
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