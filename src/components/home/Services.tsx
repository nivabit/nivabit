"use client";

import React from "react";
import Container from "../ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const services: {
  title: string;
  description: string;
  size: "normal" | "full";
  icon: (className: string) => React.ReactNode;
}[] = [
  {
    title: "Brand Design",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",

    size: "normal",
    icon: (className) => (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z' />
        <path d='M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7' />
        <path d='M14.5 17.5 4.5 15' />
      </svg>
    ),
  },
  {
    title: "Product Design",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    size: "normal",
    icon: (className: string) => (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z' />
        <path d='M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z' />
        <path d='M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z' />
        <path d='M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z' />
        <path d='M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z' />
      </svg>
    ),
  },
  {
    title: "Web Development",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    size: "normal",
    icon: (className) => (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect width='7' height='7' x='3' y='3' rx='1' />
        <rect width='7' height='7' x='14' y='3' rx='1' />
        <rect width='7' height='7' x='14' y='14' rx='1' />
        <rect width='7' height='7' x='3' y='14' rx='1' />
      </svg>
    ),
  },

  {
    title: "Project Research",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    size: "full",
    icon: (className: string) => (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='17' cy='17' r='3' />
        <path d='M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1' />
        <path d='m21 21-1.5-1.5' />
      </svg>
    ),
  },

  {
    title: "SaaS & ERP Software",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    size: "full",
    icon: (className) => (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='m3 8 4-4 4 4' />
        <path d='M7 4v16' />
        <path d='M11 12h4' />
        <path d='M11 16h7' />
        <path d='M11 20h10' />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <Container>
      <div
        className='flex flex-col items-start md:items-center justify-center md:gap-28 gap-14 '
        id='services'
      >
        <div className=' text-left md:text-center space-y-4 lg:w-3/5'>
          <h2 className='lg:text-[50px] md:text-[45px] text-[30px] font-extrabold leading-tight text-left md:text-center'>
            Elevate Your Digital Presence - Explore{" "}
            <span className='text-secondary'>Our Services</span>{" "}
          </h2>
          <p className='text-md text-gray-700'>
            We offer a range of digital solutions tailored to your business
            needs.
          </p>
        </div>
        <div className='flex flex-wrap gap-x-3 gap-y-6 items-center justify-center w-full'>
          {services.map((service, index) => (
            <div
              className={`group  ${
                service.size === "full"
                  ? " basis-full mg:basis-[50%] lg:basis-[48.5%]"
                  : " basis-full mg:basis-[50%] lg:basis-[31.7%]"
              } `}
              key={index}
            >
              <Card
                className={`hover:bg-primary rounded-tl-none shadow-none   rounded-tr-none   border border-t-0  group-hover:shadow-sm group-hover:rounded-2xl transition-all duration-500 relative ${
                  service.size === "full" && "border-0"
                }`}
              >
                <CardHeader
                  className='fill-primary
                 stroke-gray-50 group-hover:stroke-primary group-hover:fill-gray-50'
                >
                  <CardTitle className=' mb-4'>
                    <div className='bg-primary size-14 md:size-16  group-hover:bg-gray-50 rounded-2xl flex items-center justify-between pl-[1rem] md:pl-[1.2rem] pt-[.3rem] relative'>
                      {service.icon("size-8")}
                    </div>
                    <div className='hidden group-hover:block absolute right-0 top-1'>
                      <svg
                        className='w-[140px] h-[160px] stroke-none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          opacity='0.3'
                          d='M170.667 80C170.667 80 128.439 86.8113 110.458 104.792C92.4778 122.772 85.6665 165 85.6665 165C85.6665 165 84.5718 116.502 64.4165 97.7083C47.5127 81.9461 9.84177 80.2135 2.0811 80.0234C1.16513 80.0156 0.666504 80 0.666504 80C0.666504 80 1.16575 80.001 2.0811 80.0234C10.1594 80.0919 50.7003 79.5496 67.9582 62.2917C87.1729 43.0769 85.6665 -5 85.6665 -5C85.6665 -5 88.3602 40.1937 106.917 58.75C125.473 77.3063 170.667 80 170.667 80Z'
                          className='fill-muted'
                        />
                      </svg>
                    </div>
                  </CardTitle>
                  <CardDescription className='text-md text-gray-900 group-hover:text-gray-50 flex flex-col gap-2 text-xl font-extrabold'>
                    {service.title}
                    <Skeleton className='h-1 w-[80px] bg-secondary group-hover:w-0 transition-all duration-500 animate-none' />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-md font-xs text-gray-900/70 group-hover:text-gray-50'>
                    {service.description}
                  </p>
                </CardContent>
                <CardFooter className='flex justify-between items-center'>
                  <Link
                    href={"/#contact"}
                    className='text-gray-900 group-hover:text-gray-50 capitalize'
                  >
                    <span className='font-semibold'>let&apos;s talk</span>
                  </Link>
                  <Link
                    href={"/#contact"}
                    className=' group flex items-center justify-center text-center'
                  >
                    <span className='bg-transparent group-hover:bg-gray-50 p-3 rounded-xl flex items-center justify-between'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-6 h-5 transform  group-hover:rotate-45 fill-gray-900 mt-2'
                      >
                        <path d='M17.5822 13.9009V2.11089C17.5822 1.39518 17.1301 0.917856 16.3892 0.917856L4.59917 0.943035C3.90864 0.943035 3.44417 1.45786 3.44417 2.04821C3.44417 2.63804 3.97131 3.14054 4.54881 3.14054H8.29078L14.2672 2.91446L11.9819 4.92339L0.76935 16.1611C0.543814 16.3871 0.418457 16.663 0.418457 16.9271C0.418457 17.5164 0.9456 18.0821 1.5606 18.0821C1.84989 18.0821 2.11346 17.9691 2.33899 17.743L13.5767 6.50536L15.5856 4.23286L15.3595 9.94571V13.9512C15.3595 14.5287 15.862 15.0559 16.4647 15.0559C17.0545 15.0559 17.5822 14.5663 17.5822 13.9009Z' />
                      </svg>
                    </span>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
