"use client";

import { FC, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal-store";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DeleteGroupModal: FC = ({}) => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { type, isOpen, onClose, data } = useModal();

  const isModalOpen = type === 'deleteGroup' && isOpen;

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const url = `/api/groups/${data.group?.id}`;
    try {
      
      await axios.delete(url);
      handleClose()
      router.push('/groups')
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
            Eliminar grupo
          </h3>
          <p 
            className="
              mt-[15px] 
              text-[#808080] 
              text-sm
            "
          >
            Estas seguro que quieres eliminar el grupo <span className="text-white">{data.group?.name}</span>
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
            onClick={handleDelete} 
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