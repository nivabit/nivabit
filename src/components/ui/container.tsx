import React, { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <div className='container mx-auto md:px-0'>{children}</div>;
}
