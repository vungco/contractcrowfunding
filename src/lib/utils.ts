import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function shortenAddr(address?: string): string | undefined {
  if (address) {
    const start = address.substring(0, 4 + 2);
    const end = address.substring(address.length - 4);

    return `${start}...${end}`;
  } else {
    return undefined;
  }
}

export function cn(...className: ClassValue[]) {
  return twMerge(clsx(className));
}
