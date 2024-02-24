"use client";

import Image from "next/image";
import { FC, useState } from "react";
import axios from "axios";

import { Icons } from "../icons";
import { useModal } from "@/hooks/use-modal-store";
import { MemberWithProfile } from "@/types/group";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface GroupMembersProps {
  members: MemberWithProfile[],
  isAdmin: boolean,
}

export const GroupMembers: FC<GroupMembersProps> = ({ members, isAdmin }) => {
  
  const [isLoding, setIsloading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { onOpen, data } = useModal();

  const admin = members.find((member) => member.role === "ADMIN");

  const membersFilter = members.filter(e => {
    return e.profile.name.toLowerCase().includes(searchValue.toLowerCase())
  })

  const handleDelete = async (memberId: string) => {
    setIsloading(true);

    const url = `/api/members/${memberId}?groupId=${data.group?.id}`;

    try {
      
      await axios.delete(url);
      onOpen('infoGroup', { members: members.filter((member) => member.id !== memberId), group: data.group, currentMember: data.currentMember } )
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }


  return (
    <div>

      <div 
        className="px-[20px] border-[#808080] border-b-[1px] h-[90px] flex items-center">
        <div className="relative w-full rounded-[5px]">
          <input
            type="text" 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)} 
            placeholder="Search member"
            className="w-full h-[40px] bg-[#404040] text-[#808080] rounded-[5px] pl-[10px] pr-[40px] focus:outline-none text-sm font-normal"
          />
          {searchValue.length > 0 
            ? <Icons.X onClick={() => setSearchValue('')} className="absolute h-[18px] w-[18px] top-0 right-[10px] bottom-0 my-auto text-[#808080] cursor-pointer hover:text-white"/>
            : <Icons.Search className="absolute h-[18px] w-[18px] top-0 right-[10px] bottom-0 my-auto text-[#808080]"/>
          }
          
        </div>
      </div>

      <p className="ml-[10px] text-[#808080] text-sm font-semibold my-[20px]">
        Members
      </p>

      <div className="">

        <div className={cn(
          "hover:bg-[#333333] cursor-default px-[10px] py-[8px]",
          data.currentMember?.id === admin?.id ? "bg-[#333333]" : null
        )}>
          <div className="flex items-center gap-x-[10px]">
            <div className="relative h-[40px] w-[40px] rounded-full">
              <Image 
                fill
                src={admin?.profile.imageUrl!}
                alt="admin"
                className="rounded-full"
              />
            </div>
            <p className="text-white text-sm">{admin?.profile.name}</p>
            <Icons.Crown className="h-[17px] w-[17px] text-yellow-500"/>
          </div>
        </div>

        {membersFilter.map((member) => {
          
          const admin = member.role === "ADMIN";

          if(admin) return null;
          
          return (
            <div 
              key={member.id} 
              className={cn(
                "hover:bg-[#333333] cursor-default flex items-center px-[10px] py-[8px] justify-between mt-[5px]",
                data.currentMember?.id === member.id ? "bg-[#333333]" : null
              )}
            >
              <div className="flex items-center gap-x-[10px]">
                <div className="relative h-[40px] w-[40px] rounded-full">
                  <Image 
                    fill
                    src={member?.profile.imageUrl!}
                    alt="member image"
                    className="rounded-full"
                  />
                </div>
                <p className="text-white text-sm">{member?.profile.name}</p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(member.id)} 
                  className="
                    hover:bg-red-500/10
                    text-sm
                    px-[15px]
                    h-[40px]
                    rounded-[5px]
                    border-[1px]
                    border-red-500
                    text-red-500
                    font-semibold"
                >
                  {isLoding
                    ? <Icons.Loader2 className="animate-spin"/>
                    : "Expulsar"
                  }
                </button>
              )}
            </div>
          )
        })}

      </div>
        




    </div>
  )
}