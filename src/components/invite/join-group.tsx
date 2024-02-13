"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FC, useState } from "react";
import { Group } from "@prisma/client";
import axios from "axios";

import { Icons } from "@/components/icons";

interface JoinGroupProps {
  group: Group,
  inviteCode: string
}

export const JoinGroup: FC<JoinGroupProps> = ({ group, inviteCode }) => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async() => {
    setIsLoading(true);

    const url = `/api/members`

    try {

      await axios.post(url, {
        inviteCode
      });
      
      router.push('/')
    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col border-[1px] border-[#808080] bg-[#292929] p-[20px] rounded-[5px] w-[450px] items-center">

      <div className="relative h-[150px] w-[150px] rounded-full">
        <Image 
          fill
          src={group.imageUrl}
          alt="image group"
          className="rounded-full"
        />
      </div>
      <p className="text-[#808080] mt-[10px]">
        Te invitaron a unirte
      </p>
      <p className="text-2xl text-white mt-[10px]">
        {group.name}
      </p>
      
      <button disabled={isLoading} onClick={handleClick} className="bg-white w-full mt-[40px] h-[40px] rounded-[5px] font-medium disabled:cursor-not-allowed">
        {isLoading
          ? <Icons.Loader2 className="animate-spin mx-auto"/>
          : "Aceptar invitacion"
        }
      </button>

    </div>
  )
}