import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function toPusherKey(key: string){
  return key.replace(/:/g, '__')
}