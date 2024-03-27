'use client';

import Image from 'next/image';
import { ChangeEvent, FC, useRef } from 'react';

import { Icons } from '@/components/icons';


interface FileUploadProps {
  isSubmiting: boolean;
  onChange: (file: File | null) => void;
  imageValue?: string,
}

export const FileUpload: FC<FileUploadProps> = ({ onChange, imageValue, isSubmiting }) => {

  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.length === 0) return;
    onChange(e.target.files![0]);
  }

  const deleteImage = async () => {
    if(isSubmiting) return;

    onChange(null);
    
  }

  return (
    <div
      onClick={() => inputFileRef.current?.click()}
      className="
        flex
        justify-center
        hover:bg-[#262626]
        p-3
        rounded-md
        cursor-pointer
      "
    >
      {/* {isLoading && (
        <div className="w-[75px] h-[75px] flex justify-center items-center">
          <Icons.Loader2 className="w-[20px] h-[20px] animate-spin text-white"/>
        </div>
      )} */}

      {imageValue?.length === 0  && (
        <>
          <div
            className="
              border-2
              border-white
              border-dashed
              rounded-full
              w-[75px]
              h-[75px]
              flex
              flex-col
              justify-center
              items-center
              text-white
              gap-y-1
            "
          >
            <Icons.Camera className="h-[25px] w-[25px]"/>
            <p className="text-xs font-semibold">Subir</p>
          </div>
          <input
            multiple={false}
            onChange={uploadImage}
            type="file" 
            ref={inputFileRef} 
            className="hidden"
          />
        </>
      )}

      {imageValue?.length! > 0 && (
        <div
          className="
            relative
            w-[75px] h-[75px]
          "
        >
          <Image
            alt="group image"
            src={imageValue!}
            fill
            referrerPolicy="no-referrer"
            className="rounded-full"
          />
          <div
            onClick={deleteImage}
            className="
              absolute 
              top-0 
              right-0 
              bg-red-500 
              rounded-full 
              h-[25px] 
              w-[25px]
              flex
              justify-center
              items-center
              hover:bg-red-400
            "
          >
            <Icons.X className="text-white w-[15px] h-[15px]"/>
          </div>
        </div>
      )}

    </div>
  )
}