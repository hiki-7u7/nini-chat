"use client";

import { cn } from "@/lib/utils";
import { Group } from "@prisma/client";
import { FC, useState } from "react";
import { Icons } from '../icons';
import { GroupOverview } from "./group-overview";
import { MemberWithProfile } from "@/types/group";
import { GroupMembers } from "./group-members";

interface GroupInfoProps {
  onClose: () => void,
  group: Group,
  members: MemberWithProfile[],
  isAdmin: boolean,
}

interface GroupInfoOptionProps {
  id: number,
  label: string,
  actionType: string,
}

const groupInfoOptions: GroupInfoOptionProps[] = [
  {
    id: 1,
    label: 'Vista general',
    actionType: 'overview',
  },
  {
    id: 2,
    label: 'Miembros',
    actionType: 'members',
  },
]


export const GroupInfo: FC<GroupInfoProps> = ({ onClose, group, members, isAdmin }) => {

  const [currentOption, setCurrentOption] = useState('overview');

  const handleAction = (action: string) => {
    switch (action) {
      case 'overview':
        setCurrentOption(action)
        break;
      case 'members':
        setCurrentOption(action)
      default:
        break;
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(`
        h-[660px]
        w-[700px]
        bg-[#212121]
        border-[1px]
        border-[#808080]
        rounded-[5px]
        flex
        overflow-hidden
        relative
        `,
      )}>
        
        <div className="w-[200px] border-r-[1px] border-[#808080]">
          
          {groupInfoOptions.map((option) => (
            <div 
              key={option.id} 
              onClick={() => handleAction(option.actionType)} 
              className={cn(`
                hover:bg-[#333333] 
                cursor-pointer 
                h-[45px] 
                flex 
                items-center 
                px-[10px] 
                border-b-[1px]
                border-[#808080]`,
                currentOption === option.actionType ? "bg-[#333333]" : null
              )}>
                <p className="text-white text-sm">{option.label}</p>
            </div>
          ))}


        </div>
        
        {currentOption === 'overview' && (
          <Icons.X
            onClick={() => onClose()}
            className="
              cursor-pointer
              text-[#808080]
              hover:text-white
              absolute 
              top-[10px] 
              right-[10px]
              z-20"
          />
        )}

        <div className="relative flex-1">
          {currentOption === 'overview' && (
            <GroupOverview group={group} isAdmin={isAdmin}/>
          )}
          {currentOption === 'members' && (
            <GroupMembers members={members} isAdmin={isAdmin}/>
          )}
        </div>

    </div>
  )
}