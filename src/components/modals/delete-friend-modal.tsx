"use client";

import { useModal } from "@/hooks/use-modal-store";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/icons";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DeleteFriendModal: FC = ({}) => {

  const [isLoading, setIsLoading] = useState(false);

  const { type, isOpen, onClose, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'deleteFriend';

  const handleDeleteFriend = async() => {
    
    const url = `/api/conversations/${data.conversation!.id}`

    setIsLoading(true);

    try {
      await axios.delete(url);
      router.push('/conversations');
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }

  const handleClose = () => {
    onClose();
  };


  return (
    <Modal open={isModalOpen} onOpenChange={handleClose}>
    <div
      className="
        bg-[#212121] 
        border-[#808080] 
        border-[1px] 
        rounded-[5px] 
        w-[450px] 
        p-[15px] 
        relative
      "
      onClick={(e) => e.stopPropagation()}
    >
      
      <div>
        <h3 className="
          text-white 
          text-xl 
          font-medium
          "
        >
          Eliminar de amigos
        </h3>
        <p 
          className="
            mt-[15px] 
            text-[#808080] 
            text-sm
          "
        >
          Estas seguro que quieres eliminar a <span className="text-white">{data.conversationProfile?.name}</span> de amigos?
        </p>
      </div>

      <div className="flex justify-between mt-[45px]">
        <Button
          onClick={handleClose} 
          label="Cancelar" 
          className="
            w-[95px] 
            justify-center 
            bg-white 
            text-black 
            hover:text-black
          "
        />

        <Button
          isLoading={isLoading}
          onClick={handleDeleteFriend} 
          label="Eliminar" 
          className="
            w-[95px] 
            justify-center 
            bg-red-500 
            text-white
          "
        />
        
      </div>

      <Icons.X
        onClick={handleClose} 
        className="
          text-[#808080] 
          hover:text-white 
          cursor-pointer 
          absolute 
          top-[15px] 
          right-[15px]
        "
      />

    </div>
  </Modal>
  )
}