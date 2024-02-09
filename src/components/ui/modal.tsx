import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface ModalProps {
  children: ReactNode,
  open: boolean,
  onOpenChange: () => void;
}

export const Modal: FC<ModalProps> = ({ children, open, onOpenChange }) => {

  if(!open) {
    return null
  }

  return (
    <div
      onClick={onOpenChange}
      className={cn(`
          bg-[#0000]/70
          z-50
          fixed
          flex
          flex-col
          h-full
          w-full
          items-center
          justify-center`,
        )
      }
    >
      {children}
    </div>
  )
}