"use client";

import { FC, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal-store";
import { GroupInfo } from "../groups/group-info";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { MemberWithProfile } from "@/types/group";
import { useRouter } from "next/navigation";

interface InfoGroupModalProps {

}

export const InfoGroupModal: FC<InfoGroupModalProps> = ({}) => {
  
  const { isOpen, type, onClose, data, onOpen, setData} = useModal();

  const isModalOpen = isOpen && type === 'infoGroup';
  const isAdmin = data.currentMember?.role === 'ADMIN';
  const router = useRouter();

  useEffect(() => {

    if(!data.group) return;

    pusherClient.subscribe(toPusherKey(`group:${data.group?.id}:new_members`));

    const newMembersHandler = ( { members }: { members: MemberWithProfile[]}) => {
      setData("members", members )
      router.refresh();
    };

    pusherClient.bind('new_members', newMembersHandler);
    
    return () => {
      pusherClient.unsubscribe(toPusherKey(`group:${data.group?.id}:new_members`));
      pusherClient.unbind('new_members', newMembersHandler);
    }
  }, [data.group, setData]);

  useEffect(() => {

    if(!data.group || !data.members) return;

    pusherClient.subscribe(toPusherKey(`group:${data.group?.id}:member_left_the_group`));

    const memberLeftGroupHandler = ( { profileId }: {profileId: string} ) => {
      setData("members", data.members!.filter((member) => member.profileId !== profileId) )
      router.refresh();
    };

    pusherClient.bind('member_left_the_group', memberLeftGroupHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`group:${data.group?.id}:member_left_the_group`));
      pusherClient.unbind('member_left_the_group', memberLeftGroupHandler);
    }

  }, [data.group, setData])

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={isModalOpen} onOpenChange={handleClose}>
      <GroupInfo onClose={handleClose} group={data.group!} members={data.members!} isAdmin={isAdmin}/>
    </Modal>
  )
}