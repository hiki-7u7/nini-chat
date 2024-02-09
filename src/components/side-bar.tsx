'use client';

import { FC, useState } from "react";
import { UserButton } from "@clerk/nextjs";

import { Icons } from "@/components/icons";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Group, Message } from "@prisma/client";
import { ChatList } from "./chats/chat-list";


interface SidebarProps {
  page: 'groups' | 'conversations' | 'hiddens' | 'favorites',
	chats: (Group & { messages: Message[] })[]
}

export const Sidebar: FC<SidebarProps> = ({ page, chats }) => {

	const [searchValue, setSearchValue] = useState('');
	const { onOpen } = useModal();

	const onChange = (value: string) => {
		setSearchValue(value)
	}

  return (
    <div 
      className="
        hidden
        md:flex
        w-[250px]
        fixed
        bg-[#2B2B2B]
        inset-y-0
        flex-col
				border-r-2
				border-[#212121]
      "
    >
			<Search page={page} onChange={onChange} value={searchValue}/>
      { page === 'groups' && (
				<div className="p-[10px] border-b-2 border-[#212121]">
					<Button
						className="w-full"
						onClick={() => onOpen('createGroup')}
						label="Create group"
						icon={<Icons.MessageCirclePlus className="h-[20px] w-[20px]"/>}
					/>
				</div>
			)}
			<ChatList chats={chats}/>

			<div 
				className="
					h-[70px] 
					border-t-2 
					border-[#212121] 
					flex 
					justify-between 
					items-center
					px-[10px]
				"
				onClick={() => {}}
			>
				<UserButton
					appearance={{
						elements: {
							avatarBox: "h-[48px] w-[48px]"
						}
					}}
					afterSignOutUrl='/login'
				/>
				<div className="p-3 hover:bg-[#333333] rounded-full cursor-pointer">
					<Icons.Settings className="text-white h-[22px] w-[22px]"/>
				</div>
			</div>

    </div>
  )
}