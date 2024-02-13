"use client";

import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

import { Group } from "@prisma/client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { GroupImage } from "./group-image";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

interface GroupOverviewProps {
  group: Group,
  isAdmin: boolean,
}

export const GroupOverview: FC<GroupOverviewProps> = ({ group, isAdmin }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldEdit, setShouldEdit] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [values, setValues] = useState({
    imageUrl: group.imageUrl,
    name: group.name,
    description: group.description,
  });
  const [inviteCode, setInviteCode] = useState(group.inviteCode);
  const origin = useOrigin();
  const { onClose } = useModal();
  const router = useRouter();

  const inviteUrl = `${origin}/invite/${inviteCode}`;

  useEffect(() => {

    const initialValues = {
      imageUrl: group.imageUrl,
      name: group.name,
      description: group.description,
    }

    // @ts-ignore
    const hasChanged = Object.keys(values).some( key => (values[key] as string).trim() !== initialValues[key] );
    
    // @ts-ignore
    const validSubmit = Object.keys(values).every(key => (values[key] as string).length > 0 );
    
    setShouldSubmit(validSubmit);
    setShouldEdit(hasChanged);

  }, [group, values])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  };

  const handleFileChange = (fileUrl: string) => {
    setValues((prev) => ({
      ...prev,
      imageUrl: fileUrl,
    }))
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!isAdmin) return;
    if(!shouldSubmit) return;

    const url = `/api/groups/${group.id}`

    setIsLoading(true);

    try {
      const valuesToSubmit = {
        imageUrl: values.imageUrl.trim(),
        name: values.name.trim(),
        description: values.description.trim(),
      }
      await axios.patch(url, valuesToSubmit);
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }

  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false)
    }, 1500);
  }

  const handleNew = async () => {

    setIsGenerating(true);

    const url = `/api/groups/${group.id}/invite-code`
    
    try {
      
      const { data } = await axios.patch(url) as { data: Group};
      setInviteCode(data.inviteCode)
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col h-full items-center p-[20px]">
      
      {/* IMAGEN DE GRUPO */}
      <GroupImage onChange={handleFileChange} src={values.imageUrl} editable={isAdmin} />
      
      {/* INVITAR AL GRUPO */}
      <div className="h-[40px] mt-[40px] w-full rounded-[5px] flex overflow-hidden border-[1px] border-[#808080]">
        <input
          readOnly
          type="text"
          placeholder="name"
          value={inviteUrl}
          className="focus:outline-none h-[40px] px-[10px] bg-[#404040] flex-1 rounded-r-none text-white text-sm placeholder:text-[#808080]"
        />

        <div className="flex cursor-pointer bg-[#404040]">
          <div 
            onClick={handleCopy} 
            className="hover:bg-[#4d4d4d] h-full w-[40px] flex items-center justify-center border-l-[1px] border-[#808080]"
          > 
            {isCopied
              ? <Icons.Check className="h-[19px] w-[19px] text-white"/>
              : <Icons.Copy className="h-[19px] w-[19px] text-white"/>
            }
          </div>
          {isAdmin && (
            <div 
              onClick={handleNew} 
              className="hover:bg-[#4d4d4d] h-full w-[40px] flex items-center justify-center border-l-[1px] border-[#808080]"
            >
              <Icons.RefreshCcw className={cn(
                "h-[19px] w-[19px] text-white",
                isGenerating ? 'animate-spin' : null
              )}/>
            </div>
          )}
        </div>
      </div>
      
      {/* INFO DEL GRUPO */}
      <form onSubmit={handleSubmit} className="mt-[20px] flex flex-col gap-y-[20px] w-full flex-1">
        
        <div className="flex flex-col gap-y-2 relative">
          <label htmlFor="name" className="text-[#808080] font-semibold text-xs">Name</label>
          <input
            disabled={!isAdmin}
            type="text"
            placeholder="Name"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
            className="w-full focus:outline-none rounded-[5px] h-[40px] px-[10px] bg-[#404040] text-white text-sm placeholder:text-[#808080]"
          />
          {isAdmin && (
            <Icons.Pencil className="text-[#808080] h-[14px] w-[14px] top-0 absolute left-[44px]"/>
          )}
        </div>
        
        <div className="flex flex-col gap-y-2 relative">
          <label htmlFor="description" className="text-[#808080] font-semibold text-xs">Description</label>
          <textarea
            onChange={handleChange}
            name="description"
            id="description"
            disabled={!isAdmin}
            value={values.description}
            placeholder="Description"
            className="h-[100px] focus:outline-none resize-none rounded-[5px] p-[10px] bg-[#404040] text-white text-sm placeholder:text-[#808080]" 
          />
          {isAdmin && (
            <Icons.Pencil className="text-[#808080] h-[14px] w-[14px] absolute top-0 left-[77px]"/>
          )}
        </div>
       
        <div className="flex flex-col gap-y-2">
          <p className="text-[#808080] text-xs font-semibold">Creado</p>
          <div className="bg-[#404040] px-[10px] rounded-[5px] h-[40px] flex items-center">
            <p className="text-white text-sm">
              {group.createdAt.toDateString()}
            </p>
          </div>
        </div>

        {isAdmin && shouldEdit && (
          <Button
            disabled={!shouldSubmit || isLoading}
            type="submit" 
            isLoading={isLoading} 
            label="Save" 
            className={cn(
              "w-fit px-[25px] ml-auto bg-white font-bold text-black text-[16px] mt-auto hover:bg-[hsl(0,0%,60%)] hover:text-black",
              isLoading ? 'cursor-not-allowed' : null,
              !shouldSubmit ? 'cursor-not-allowed' : null
            )}/>
        )}
        
      </form>
    
    </div>
  )
}