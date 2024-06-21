"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import DialAwards from "../../../public/clients/FINAL-GOLD.png";
import TheImisiOluwa from "../../../public/clients/Imisi-navy-1170x498.png";
import EdgdMedia from "../../../public/clients/logo-slant-e1662252738309.png";
import Lafiami from "../../../public/clients/logo.png";
import ProjectEnable from "../../../public/clients/project-enable-logo-png.png";
import StanforteEdge from "../../../public/clients/stanforteedge-logo-trans.png";
import Image from "next/image";

const services: { title: string; logo: any }[] = [
  { title: "DialAward", logo: DialAwards },
  { title: "TheImisiOluwa", logo: TheImisiOluwa },
  { title: "EdgdMedia", logo: EdgdMedia },
  { title: "Lafiami", logo: Lafiami },
  { title: "Project Enable", logo: ProjectEnable },
  { title: "Stanforteedge", logo: StanforteEdge },
];

export default function ClientCarouselSpacing() {
  return (
    <div className='flex justify-center  items-center my-16 md:my-32 w-full  bg-white'>
      <div className=' lg:basis-[25%] md:basis-[40%] hidden lg:flex'>
        <h2 className='w-full self-center text-center font-bold md:text-lg lg:text-2xl text-primary capitalize'>
          Trust clients
        </h2>
      </div>
      <Carousel
        className=''
        opts={{ loop: true, align: "center", duration: 3000 }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className='-ml-1'>
          {services.map(({ title, logo }, index) => (
            <CarouselItem
              key={index}
              className='pl-1 basis-[40%] md:basis-1/2 lg:basis-[30%]'
            >
              <div className=''>
                <Card className='border-none bg-white text-card-foreground shadow-none m-0  rounded-none'>
                  <CardContent
                    className='flex items-center justify-center
                  h-[100px] w-full lg:space-x-10 p-4 lg:p-6 shadow-none relative'
                  >
                    <svg
                      className=' size-8 lg:size-[30px] hidden lg:inline-table  fill-secondary absolute left-0 '
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                    </svg>
                    <div className=''>
                      <Image
                        src={logo}
                        alt={title}
                        className='object-cover w-[10rem]'
                        loading='lazy'
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
