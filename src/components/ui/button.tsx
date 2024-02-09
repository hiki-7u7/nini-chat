"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean,
    icon?: JSX.Element,
    label?: string
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  isLoading,
  icon,
  label,
  ...props
}) => {
  return (
    <button
      className={cn(`
      bg-[#404040]
        rounded-[5px] 
        h-[40px]
        font-medium
        flex
        justify-between
        items-center
        px-[10px]
        text-sm
        text-[#808080]
        hover:text-white
      `,
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {label}
      {isLoading ? <Loader2 className="h-[20px] w-[20px] animate-spin"/>  : icon}
    </button>
  )
}