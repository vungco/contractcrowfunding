import React from "react";
import { cn } from "../lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: void;
}
const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-3 py-2 text-sm text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
