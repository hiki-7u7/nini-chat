"use client";

import { Group } from "@prisma/client";
import { FC, useState } from "react";
import { Icons } from "@/components/icons";
import axios from "axios";

interface GroupChatInputProps {
  group: Group,
}

const intialValues = {
  content: '',
  fileUrl: null,
}

export const GroupChatInput: FC<GroupChatInputProps> = ({ group }) => {

  const [sendingMessage, setSendingMessage] = useState(false);
  const [values, setValues] = useState(intialValues);

  const handleSend = async () => {

    if(!values.content.length) return;
    
    const url = `/api/messages?groupId=${group.id}`;

    setSendingMessage(true);

    try {
      await axios.post(url, values);
      setValues(intialValues)
    } catch (error) {
      console.log(error);
    } finally {
      setSendingMessage(false);
    }

  }

  return (
    <div className="flex h-[70px] bg-[#292929] border-t-2 border-[#212121]">
      
      <div className="w-[80px] h-full flex justify-center items-center">
        <div className="p-3 hover:bg-[#333333] rounded-full cursor-pointer">
          <Icons.Plus className="h-[22px] w-[22px] text-white"/>
        </div>
      </div>
      
      <input
        disabled={sendingMessage}
        type="text"
        placeholder={`Enviar mensaje`}
        value={values.content}
        onChange={(e) => setValues({...values, content: e.target.value})}
        onKeyUp={(e) => e.key === "Enter" && handleSend()}
        className="
          flex-1
          my-[10px]
          bg-[#404040]
          rounded-[5px]
          px-[20px]
          text-white
          placeholder:text-[#808080]
          focus:outline-none
        "
      />
      
      <div className="w-[80px] h-full flex justify-center items-center">
        
        {
          sendingMessage
          ? (
            <div 
              className="p-3 hover:bg-[#333333] rounded-full cursor-pointer"
            >
              <Icons.Loader2 className="h-[22px] w-[22px] text-white animate-spin"/>
            </div>
          )
          : (
            <div
              onClick={handleSend} 
              className="p-3 hover:bg-[#333333] rounded-full cursor-pointer"
            >
              <Icons.SendHorizonal className="h-[22px] w-[22px] text-white"/>
            </div>
          )
        }

        
      </div>
      
    </div>
  )
}