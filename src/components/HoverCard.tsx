import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HoverCard({
  className,
  icon,
  title,
  content,
}: {
  className: string;
  icon: any;
  title: string;
  content: string;
}) {
  return (
    <>
      <div
        className={cn(
          "group  w-[200px] transition-all duration-300",
          className
        )}
      >
        <Card>
          <CardHeader className='py-4'>
            <CardTitle>
              <i className='fill-orange-500 font-medium group-hover:fill-blue-900/50 group-hover:pt-1 transition duration-300'>
                {icon}
              </i>
            </CardTitle>
            <CardDescription className='text-orange-500 font-medium group-hover:text-blue-900 group-hover:pt-1 transition-all duration-300'>
              {title}
            </CardDescription>
          </CardHeader>
          <CardContent className='transition-all duration-300'>
            <div className='space-y-2 group-hover:hidden transition-all duration-300'>
              <Skeleton className='h-1 w-[60px] animate-none bg-gray-300' />
              <Skeleton className='h-1 w-[100px] animate-none bg-gray-300' />
              <Skeleton className='h-1 w-[80px] animate-none bg-gray-300' />
            </div>
            <p className='hidden group-hover:flex h-auto text-xs transition-all duration-300'>
              {content}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
