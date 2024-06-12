"use client";

import React from "react";
import Container from "../ui/container";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import Fermerce from "../../../public/portfolios/fermerce.png";
import Ennibee from "../../../public/portfolios/ennibee.png";
import TravelBetter from "../../../public/portfolios/travelbetter.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

const portfolios: {
  title: string;
  description: string;
  image: StaticImageData;
  url: string;
  tags?: string[];
}[] = [
  {
    title: "Fermerce Branding",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    url: "https://www.google.com/design",
    image: Fermerce,
    tags: ["Graphic Design", "Branding", "Wep Application"],
  },
  {
    title: "Travelbetta Mobile App Design",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    url: "https://www.google.com/design",
    image: TravelBetter,
    tags: ["Transportation", "Ticket Booking"],
  },
  {
    title: "Brand Design 3",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    url: "https://www.google.com/design",
    image: Ennibee,
  },
  {
    title: "Ennibee Branding",
    description:
      "Our versatile team merges diverse talents, enabling us to approach projects from a comprehensive standpoint that seamlessly blends creativity with functionality.",
    url: "https://www.google.com/design",
    image: TravelBetter,
    tags: ["Graphic Design", "Branding", "Fashion"],
  },
];

export function PortfolioCard({
  title,
  description,
  url,
  image,
  tags = ["testing", "testing2", "testing3"],
}: {
  title: string;
  description: string;
  url: string;
  image: any;
  tags?: string[];
}) {
  return (
    <div className='group '>
      <div className='group-hover:p-2 group-hover:bg-white rounded-2xl p-2 bg-transparent group-hover:shadow-md group-hover:rounded-2xl'>
        <Card className=' shadow-none border-none bg-gray-50 group-hover:bg-accent  group-hover:shadow-md rounded-2xl'>
          <CardHeader className=''>
            <CardTitle className='mb-4'>{title}</CardTitle>
            <CardDescription className='text-gray-900 w-2/3 '>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className='flex flex-wrap gap-3 mb-4'>
                {tags.map((name, index) => (
                  <Button
                    className='inline-block bg-accent   text-primary group-hover:bg-primary  group-hover:text-gray-50 capitalize font-bold'
                    key={index}
                  >
                    {name}
                  </Button>
                ))}
              </div>
              <Image
                src={image}
                alt={title}
                className='w-full  h-64 object-cover rounded-2xl'
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-between items-center'>
            <Link href={url} className='text-gray-900 capitalize'>
              <span>Take a look</span>
            </Link>
            <Link
              href={url}
              className=' group flex items-center justify-center text-center'
            >
              <span className='bg-transparent group-hover:bg-gray-50 p-3 rounded-2xl flex items-center justify-between'>
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
    </div>
  );
}

export default function Portfolio() {
  return (
    <Container>
      <div className='mb-48 space-y-32' id='portfolio'>
        <div className='grid  grid-cols-1 md:grid-cols-2 justify-between gap-10'>
          <h2 className='text-[50px] font-extrabold leading-snug text-left'>
            Take a Glimpse Into
            <span className='text-secondary'>What&apos;s Possible</span> With
            Nivabit
          </h2>
          <p className=' text-start text-gray-500 my-5'>
            Explore a curated selection of our past projects. From innovative
            mobile apps to stunning websites, our portfolio showcases the
            diverse range of industries we&apos;ve worked with and the
            exceptional results we&apos;ve achieved.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-x-4 gap-y-8 mt-8'>
          {portfolios.map(({ title, description, url, image, tags }, index) => (
            <PortfolioCard
              title={title}
              description={description}
              image={image}
              url={url}
              key={index}
              tags={tags}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
