import React from "react";
import { cn } from "../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn("p-2 border rounded-lg shadow-lg", className)}>
      {children}
    </div>
  );
};

export default Card;
