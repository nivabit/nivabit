"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const services = [
  "Brand Design",
  "Product Design",
  "Web Development",
  "Project Research",
  "Software as a  service",
  "ERP Application",
  "Mobile app development",
];

export default function ServicesCarouselSpacing() {
  return (
    <div className='justify-center flex items-center mt-20 lg:mt-48'>
      <Carousel
        className='w-full  bg-primary'
        opts={{ loop: true, align: "center", duration: 3000 }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className='-ml-1  h-[75px] lg:h-[100px] flex items-center w-full'>
          {services.map((name, index) => (
            <CarouselItem
              key={index}
              className='pl-1 basis-[100%] md:basis-1/2 lg:basis-[28%]'
            >
              <div className='p-1'>
                <Card className='rounded-lg border-none bg-transparent text-card-foreground shadow-sm'>
                  <CardContent className='relative flex items-center justify-center p-2 h-full w-full space-x-8'>
                    <svg
                      className='size-[30px]  absolute fill-secondary left-0'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                    </svg>
                    <span className='lg:text-[32px] text-[20px] font-semibold text-gray-50 capitalize font-serif'>
                      {name}
                    </span>
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
