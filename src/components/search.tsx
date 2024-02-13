"use client";

import { FC } from 'react';
import { Icons } from '@/components/icons';

interface SearchProps {
  page: string,
  onChange: ( value: string ) => void,
  value: string,
}

export const Search: FC<SearchProps> = ({ page, onChange, value }) => {
  return (
    <div className="h-[70px] bg-[#292929] border-b-2 border-[#212121] flex items-center">
    <div
      className="
        w-full
        relative
        h-[40px]
        mx-[10px]
        rounded-[5px]
      "
    >
      <input
        onChange={(e) => onChange(e.target.value)}
        value={value}
        type="text" 
        placeholder={`Search ${page === 'groups' 
          ? page.slice(0,-1)
          : 'conversation'
        }`} 
        className="
          text-[#808080]
          focus:outline-none
          rounded-[5px]
          h-full 
          w-full 
          bg-[#404040]
          placeholder:text-[#808080]
          text-sm 
          font-medium
          pl-[10px]
          pr-[36px]
        "
      />
      {!value.length
        ? (<Icons.Search
          className="
          text-[#808080]
            absolute 
            right-[10px]
            inset-y-0
            m-auto
            w-[20px]
            h-[20px]
          "
        />)
        : (<Icons.X
          onClick={() => onChange('')}
          className="
          text-[#808080]
            absolute 
            right-[10px]
            inset-y-0
            m-auto
            w-[20px]
            h-[20px]
            cursor-pointer
            hover:text-white
          "
        />)
      }
      
    </div>
  </div>
  )
}