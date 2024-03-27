'use client';

import { FC, useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal-store";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import axios from "axios";

interface FriendRequestModalProps {

}

export const FriendRequestModal: FC<FriendRequestModalProps> = ({}) => {
  
  
  const [values, setValues] = useState({ 
    codeRequest: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { type, isOpen, onClose, data } = useModal();
  const isModalOpen = type === 'friendRequest' && isOpen;

  useEffect(() => {
    if(isOpen && data.conversationProfile){
      setValues({codeRequest: data.conversationProfile?.friendRequestID! })
    }
  }, [data.conversationProfile, isOpen])

  useEffect(() => {
    if(!isOpen) {
      setValues({codeRequest: '' })
    }
  }, [isOpen])

  const handleSendRequest = async () => {
    
    const url = `/api/friend-requests`;

    setIsLoading(true);
    try {
      await axios.post(url, values );
      handleClose();
      setValues({ codeRequest: '' });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            Añadir amigo
          </h3>
          <p 
            className="
              mt-[15px] 
              text-[#808080] 
              text-sm
            "
          >
            Puedes añadir amigos con su codigo de solicitud
          </p>
        </div>
      
       <div className="flex mt-[15px] gap-x-[5px]">
        <input
          readOnly={!!data.conversationProfile}
          className="
            rounded-[5px] 
            h-[40px] 
            flex-1 
            bg-[#404040] 
            focus:outline-none 
            px-[10px]
            placeholder:text-[#808080]
            text-white
            text-sm
          "
          onChange={(e) => setValues({...values, codeRequest: e.target.value})}
          value={values.codeRequest}
          type="text"
          placeholder="Codigo de solicitud"
        />
        <Button
          className="bg-white text-black hover:text-black font-semibold"
          label="Enviar"
          onClick={handleSendRequest}
          isLoading={isLoading}
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