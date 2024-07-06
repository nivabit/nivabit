import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(`container lg:max-w-[1440px] lg:px-[30] px-2 ${className}`)}
    >
      {children}
    </div>
  );
}
