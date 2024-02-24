"use client";

import Image from "next/image";
import { ChangeEvent, FC, useRef } from "react";
import { Icons } from "@/components/icons";
import axios from "axios";
import { CloudinaryResponse } from "@/interfaces/cloudinary-response";

interface GroupImageProps {
  src: string,
  editable: boolean,
  onChange: (fileUrl: string) => void;
}

export const GroupImage: FC<GroupImageProps> = ({ editable, src, onChange }) => {

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.target.click();

    if(e.target.files!.length === 0) return;
    
    const url = `/api/files`;
    const file = e.target?.files![0]
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post<CloudinaryResponse>(url, formData); 
      onChange(data.secure_url);
    } catch (error) {
      console.log(error);
    } finally {
      e.target.value = '';
    }

  }

  if(!src) return null

  return (
    <div className="relative h-[125px] w-[125px] rounded-full mt-[20px]">
    <Image 
      fill
      src={src}
      alt="image group"
      className="rounded-full"
    />
    {editable && (
      <>
        <div onClick={() => inputFileRef.current?.click()} className="h-full w-full bg-black/50 justify-center items-center top-0 absolute cursor-pointer rounded-full flex opacity-0 hover:opacity-100">
          <Icons.Pencil className="h-[25px] w-[25px] text-white"/>
        </div>
        <input onChange={handleChange} multiple={false} type="file" ref={inputFileRef} className="hidden" />
      </>
    )}
  </div>
  )
}