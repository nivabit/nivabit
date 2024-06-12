import React, { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <div className='w-[80%] mx-auto'>{children}</div>;
}
