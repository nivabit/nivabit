"use client";
import Container from "@/components/ui/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SampleImage from "../../../public/banner-img.png";
import Image, { StaticImageData } from "next/image";
const CustomerQuotes: {
  name: string;
  position: string;
  company: string;
  description: string;
  image: StaticImageData;
}[] = [
  {
    name: "kokoserver Daneil",
    position: "CEO",
    company: "Kokoserver",
    description:
      "Our versatile team merges diverse talents, enabling us to approach project from acco",
    image: SampleImage,
  },
  {
    name: "kokoserver Daneil",
    position: "CEO",
    company: "Kokoserver",
    description:
      "Our versatile team merges diverse talents, enabling us to approach project from acco",
    image: SampleImage,
  },
  {
    name: "kokoserver Daneil",
    position: "CEO",
    company: "Kokoserver",
    description:
      "Our versatile team merges diverse talents, enabling us to approach project from acco",
    image: SampleImage,
  },
  {
    name: "kokoserver Daneil",
    position: "CEO",
    company: "Kokoserver",
    description:
      "Our versatile team merges diverse talents, enabling us to approach project from acco",
    image: SampleImage,
  },
  {
    name: "kokoserver Daneil",
    position: "CEO",
    company: "Kokoserver",
    description:
      "Our versatile team merges diverse talents, enabling us to approach project from acco",
    image: SampleImage,
  },
  {
    name: "kokoserver Daneil",
    position: "CEO",
    company: "Kokoserver",
    description:
      "Our versatile team merges diverse talents, enabling us to approach project from acco",
    image: SampleImage,
  },
];

export default function Testimonials() {
  const [preActive, setPreActive] = useState(false);
  const [nextActive, setNextActive] = useState(true);
  return (
    <Container>
      <div className=' mb-48 flex flex-col gap-16'>
        <div className=''>
          <div className='flex flex-col md:flex-row items-center justify-start text-start'>
            <h2 className='text-[50px] font-extrabold leading-snug text-left'>
              <span className='text-secondary '>Quotes </span>
              From Satisfied Clients Highlighting Their Experience
            </h2>

            <div className='p-1'>
              <p className='text-start text-gray-500 mb-[7.25rem]'>
                Explore a curated selection of our past projects. From
                innovative mobile apps to stunning websites, our portfolio
                showcases the diverse range of industries we&apos;ve worked with
                and the exceptional results we&apos;ve achieved.
              </p>
            </div>
          </div>
        </div>
        <Carousel className='w-full'>
          <CarouselContent className='flex items-center gap-5'>
            {CustomerQuotes.map(
              ({ name, position, description, company, image }, index) => (
                <CarouselItem
                  key={index}
                  className=' basis-full md:basis-[25%]'
                >
                  <Card
                    className='bg-accent border shadow-sm rounded-md transition-all duration-500 relative'
                    key={index}
                  >
                    <CardHeader>
                      <CardTitle className=' mb-4'>
                        <div className='   relative'>
                          <Image
                            src={image ?? SampleImage}
                            alt={name}
                            className='h-16 w-16 rounded-md shadow-md border'
                          />
                        </div>
                        <div className='absolute -right-4 top-6'>
                          <svg
                            className='size-[7rem]'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g style={{ mixBlendMode: "screen" }}>
                              <path
                                d='M20.1772 1.40871C20.6545 1.05071 21.1977 0.790232 21.7757 0.642151C22.3537 0.49407 22.9552 0.461284 23.5458 0.545665C24.1365 0.630046 24.7048 0.829943 25.2182 1.13394C25.7316 1.43794 26.1801 1.84008 26.5381 2.31742C26.8961 2.79475 27.1566 3.33792 27.3047 3.91592C27.4528 4.49392 27.4855 5.09542 27.4012 5.68609C27.3168 6.27676 27.1169 6.84503 26.8129 7.35844C26.5089 7.87186 26.1067 8.32037 25.6294 8.67837C18.5233 14.0079 14.4523 19.1921 12.1215 23.7175C15.3218 22.8937 18.6993 23.0873 21.7845 24.2716C24.8697 25.4558 27.5093 27.5718 29.3364 30.3254C31.1636 33.079 32.0875 36.3335 31.9797 39.6364C31.8719 42.9393 30.7379 46.1266 28.7351 48.7552C26.7324 51.3839 23.9604 53.3233 20.8046 54.3039C17.6488 55.2846 14.2659 55.2577 11.126 54.227C7.98621 53.1963 5.24547 51.2131 3.28478 48.5529C1.32408 45.8927 0.24083 42.6878 0.185597 39.3836C-0.396602 33.8038 0.395828 28.1663 2.49371 22.9633C5.20621 16.1207 10.5085 8.6602 20.1772 1.40871ZM61.069 1.40871C61.5463 1.05071 62.0895 0.790232 62.6675 0.642151C63.2455 0.49407 63.847 0.461284 64.4377 0.545665C65.0284 0.630046 65.5966 0.829943 66.11 1.13394C66.6235 1.43794 67.072 1.84008 67.43 2.31742C67.788 2.79475 68.0484 3.33792 68.1965 3.91592C68.3446 4.49392 68.3774 5.09542 68.293 5.68609C68.2086 6.27676 68.0087 6.84503 67.7047 7.35844C67.4007 7.87186 66.9986 8.32037 66.5213 8.67837C59.4152 14.0079 55.3442 19.1921 53.0133 23.7175C56.2137 22.8937 59.5911 23.0873 62.6763 24.2716C65.7615 25.4558 68.4011 27.5718 70.2283 30.3254C72.0554 33.079 72.9793 36.3335 72.8715 39.6364C72.7638 42.9393 71.6297 46.1266 69.627 48.7552C67.6242 51.3839 64.8523 53.3233 61.6965 54.3039C58.5406 55.2846 55.1577 55.2577 52.0179 54.227C48.8781 53.1963 46.1373 51.2131 44.1766 48.5529C42.2159 45.8927 41.1327 42.6878 41.0774 39.3836C40.4952 33.8038 41.2877 28.1663 43.3856 22.9633C46.1026 16.1207 51.4004 8.6602 61.069 1.40871Z'
                                className='fill-muted'
                              />
                            </g>
                          </svg>
                        </div>
                      </CardTitle>
                      <CardDescription className='flex flex-col gap-2'>
                        <h3 className=' font-normal text-lg text-gray-700 text-left capitalize'>
                          {name}
                        </h3>
                        <h3 className='font-normal text-lg text-primary text-left capitalize'>
                          <span className='uppercase'>{position}</span>,{" "}
                          {company}
                        </h3>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className='text-md font-xs text-gray-900/70 '>
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious
            className={`absolute transition-colors border border-primary duration-300 left-[88rem] top-[-100px] rounded-md h-12 w-12 ${
              preActive && "!bg-primary !text-gray-50 border-transparent"
            }`}
            onClick={() => {
              setNextActive(false);
              setPreActive(true);
            }}
          >
            <svg
              className={`size-4 pl-1 ${
                preActive ? "fill-gray-50" : "fill-primary"
              }`}
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M7.15995 2.41586C7.52769 2.05138 7.53034 1.4578 7.16586 1.09005C6.80138 0.722305 6.2078 0.719657 5.84005 1.08414L3.59664 3.30762C2.75167 4.14505 2.06108 4.82949 1.57132 5.43932C1.06203 6.07348 0.693369 6.71716 0.594886 7.4898C0.551705 7.82858 0.551705 8.17142 0.594886 8.5102C0.693369 9.28284 1.06203 9.92652 1.57132 10.5607C2.06108 11.1705 2.75166 11.8549 3.59662 12.6924L5.84005 14.9159C6.2078 15.2803 6.80138 15.2777 7.16586 14.9099C7.53034 14.5422 7.52769 13.9486 7.15995 13.5841L4.95624 11.4C4.06187 10.5136 3.44837 9.90353 3.03324 9.38662C2.62999 8.8845 2.49166 8.56198 2.45484 8.27313C2.43172 8.09176 2.43172 7.90824 2.45484 7.72687C2.49166 7.43802 2.62999 7.1155 3.03324 6.61338C3.44837 6.09647 4.06187 5.48642 4.95624 4.6L7.15995 2.41586Z' />
            </svg>
          </CarouselPrevious>
          <CarouselNext
            className={`absolute transition-colors border border-primary duration-300 -right-0 top-[-33%]  rounded-md h-12 w-12 ${
              nextActive && "!bg-primary !text-gray-50 border-transparent"
            }`}
            onClick={() => {
              setNextActive(true);
              setPreActive(false);
            }}
          >
            <svg
              className={`size-4 pl-1 ${
                nextActive ? "fill-gray-50" : "fill-primary"
              }`}
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M2.15995 1.08414C1.7922 0.719657 1.19862 0.722305 0.834136 1.09005C0.469657 1.4578 0.472305 2.05138 0.840052 2.41586L3.04376 4.6C3.93813 5.48642 4.55163 6.09647 4.96676 6.61338C5.37001 7.1155 5.50834 7.43802 5.54516 7.72687C5.56828 7.90824 5.56828 8.09176 5.54516 8.27313C5.50834 8.56198 5.37001 8.8845 4.96676 9.38662C4.55163 9.90353 3.93813 10.5136 3.04376 11.4L0.840052 13.5841C0.472305 13.9486 0.469657 14.5422 0.834136 14.9099C1.19862 15.2777 1.7922 15.2803 2.15995 14.9159L4.40336 12.6924C5.24833 11.855 5.93892 11.1705 6.42868 10.5607C6.93797 9.92652 7.30663 9.28284 7.40511 8.5102C7.4483 8.17142 7.4483 7.82858 7.40511 7.4898C7.30663 6.71716 6.93797 6.07348 6.42868 5.43932C5.93892 4.82948 5.24833 4.14505 4.40336 3.30762L2.15995 1.08414Z' />
            </svg>
          </CarouselNext>
        </Carousel>
      </div>
    </Container>
  );
}
