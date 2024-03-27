"use client";

import { Conversation } from "@prisma/client";
import { ChangeEvent, ElementRef, FC, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import axios from "axios";
import Image from "next/image";

interface ChatInputProps {
  apiUrl: string;
  query: string,
}

interface MediaInterface {
  type?: "img" | "pdf",
  file: File | null,
  src?: string,
}

const intialValues: {
  content: string,
  file: File | null,
} = {
  content: '',
  file: null,
}

export const ChatInput: FC<ChatInputProps> = ({ apiUrl, query }) => {

  const [sendingMessage, setSendingMessage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [values, setValues] = useState(intialValues);
  const [media, setMedia] = useState<MediaInterface>({
    file: null,
  });

  const inputFileRef = useRef<ElementRef<"input">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.length === 0) return;

    const fileReader = new FileReader();

    fileReader.onload = function() {
      setMedia({
        type: 'img',
        file: e.target.files![0],
        src: fileReader.result as string,
      });
      setValues({...values, file: e.target.files![0]})
      e.target.value = "";
    };
        
    fileReader.readAsDataURL(e.target.files![0]);
    setShowOptions(false);
  }

  const handleSend = async () => {
    if(!media.file && !values.content.length) return;
    
    const url = `${apiUrl}?${query}`;

    const formData = new FormData();
    formData.append('content', values.content);
    formData.append('file', values.file!);

    setSendingMessage(true);

    try {
      await axios.post(url, formData);
      setValues(intialValues);
      setMedia({file: null});
    } catch (error) {
      console.log(error);
    } finally {
      setSendingMessage(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1);
      
    }

  }

  return (
    <>
      {media.file && (
        <div className="border-t-2 border-[#212121] p-[20px]">

          <div 
            className="
              bg-[#212121] 
              p-[7px] 
              w-fit 
              rounded-[5px] 
              relative
            "
          >
            <div className="relative h-[150px] w-[150px] rounded-[5px]">
              <Image
                alt="image selected"
                src={media.src!}
                fill
                className="rounded-[5px]"
              />
            </div>
            <p className="text-white text-sm mt-[7px]">
              {media.file.name.length > 15
                ? media.file.name.substring(0,15) + "..."
                : media.file.name
              }
            </p>
            
            <div 
              className="
                absolute 
                top-0
                right-0
                bg-[#404040]
                flex
                rounded-[5px]
                cursor-pointer
              "
            >
              <div
                className="
                  h-[28px]
                  w-[28px]
                  flex
                  justify-center
                  items-center
                "
                onClick={() => inputFileRef.current?.click()}
              >
                <Icons.Pencil className="text-white h-[17px] w-[17px]"/>
              </div>

              <div
                className="
                  h-[28px]
                  w-[28px]
                  flex
                  justify-center
                  items-center
                "
                onClick={() => setMedia({file:null}) }
              >
                <Icons.Trash className="text-white h-[17px] w-[17px]"/>
              </div>
              
            </div>

          </div>

        </div>
      )}

      <div className="flex h-[70px] bg-[#292929] border-t-2 border-[#212121]">
        
        <div className="w-[80px] h-full flex justify-center items-center">
          <div
            onClick={() => setShowOptions(!showOptions)} 
            className="p-3 hover:bg-[#333333] rounded-full cursor-pointer">
            <Icons.Plus className="h-[22px] w-[22px] text-white"/>
          </div>
        </div>
        
        <input
          ref={inputRef}
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
      
      {showOptions && (
        <div
          className="
            absolute 
            bg-[#212121]
            w-[200px] 
            left-[10px] 
            -top-[70px]
            rounded-[5px]
            p-[10px]
          "
        >
          <div
            onClick={() => inputFileRef.current?.click()}
            className="
              h-[40px]
              rounded-[5px] 
              flex 
              items-center 
              pl-[10px]
              cursor-pointer
              hover:bg-[#262626] 
            "
          >
            <Icons.FileUp className="text-[#808080] h-[25px] w-[25px]"/>
            <p className="pl-[10px] text-[#808080] font-semibold">Subir archivo</p>
          </div>
        </div>
      )}

      <input 
        type="file" 
        multiple={false} 
        className="hidden" 
        ref={inputFileRef}
        onChange={handleChangeFile} 
      />
    </>
    
  )
}