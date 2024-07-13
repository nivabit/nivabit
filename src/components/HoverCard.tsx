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
          "group  w-[10rem] md:w-[14rem] lg:w-[170px]    transition-all duration-300",
          className
        )}
      >
        <Card className='rounded-[14px] md:p-2 p-1'>
          <CardHeader className=' py-1 md:py-4 md:px-[.8rem] px-[10px]'>
            <CardTitle>
              <i className='fill-secondary font-medium  group-hover:fill-primary group-hover:pt-1 transition duration-300'>
                {icon}
              </i>
            </CardTitle>
            <CardDescription className='text-secondary font-medium group-hover:text-primary  group-hover:pt-1 transition-all duration-300 text-xs'>
              {title}
            </CardDescription>
          </CardHeader>
          <CardContent className='transition-all duration-300 p-2 '>
            <div className='space-y-1 md:space-y-2 group-hover:hidden transition-all duration-300 hidden lg:block'>
              <Skeleton className='h-1 w-[70%] animate-none bg-gray-300' />
              <Skeleton className='h-1 w-[90%] animate-none bg-gray-300' />
              <Skeleton className='h-1 w-[80%] animate-none bg-gray-300' />
            </div>
            <p className='block lg:hidden group-hover:flex h-auto text-xs transition-all duration-300'>
              {content}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
