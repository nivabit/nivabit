"use client";

import Image from "next/image";
import MeetUsImage from "../../../public/meetus.png";
import Container from "../ui/container";

export default function MeetUs() {
  return (
    <div className='w-full '>
      <Container className=' '>
        <div
          className='flex  flex-col-reverse lg:flex-row items-center justify-between lg:gap-[4rem] gap-[4rem] mt-42 lg:mt-[12rem]  lg:mb-28 '
          id='about-us'
        >
          <div className='w-full lg:w-1/2 '>
            <h2 className='text-[30px]  md:text-[45px] lg:text-[56px] font-extrabold leading-tight font-grotesk text-primary '>
              Meet Nivabit, Your{" "}
              <span className='text-secondary'>Digital Transformation</span>{" "}
              Partner
            </h2>
            <p className=' text-left text-gray-500 my-5'>
              At Nivabit, we&apos;re more than just a digital agency – we&apos;
              re your partners in innovation. Our team of passionate experts is
              dedicated to transforming your digital dreams into reality. With a
              wealth of experience and an unwavering commitment to excellence,
              we collaborate closely with you to deliver solutions that not only
              meet but exceed your expectations. We prioritize:
            </p>
            <ul className=' list-none space-y-4'>
              <li className='flex items-center space-x-2 '>
                <svg
                  className='h-8 w-8 fill-secondary pb-1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                </svg>
                <span className='capitalize text-gray-700'>Innovation</span>
              </li>
              <li className='flex items-center space-x-2 '>
                <svg
                  className='h-8 w-8 fill-secondary pb-1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                </svg>
                <span className='capitalize text-gray-700'>
                  Agile Adaptation
                </span>
              </li>
              <li className='flex items-center space-x-2 '>
                <svg
                  className='h-8 w-8 fill-secondary pb-1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                </svg>
                <span className='capitalize text-gray-700'>
                  Collaborative Partnerships
                </span>
              </li>
              <li className='flex items-center space-x-2'>
                <svg
                  className='h-8 w-8 fill-secondary pb-1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                </svg>
                <span className=' capitalize text-gray-700'>
                  Quality Assurance
                </span>
              </li>
              <li className='flex items-center space-x-2'>
                <svg
                  className='h-8 w-8 fill-secondary pb-1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M30 15.5C30 15.5 22.548 16.702 19.375 19.875C16.202 23.048 15 30.5 15 30.5C15 30.5 14.8068 21.9416 11.25 18.625C8.26697 15.8434 1.61916 15.5377 0.249635 15.5041C0.0879921 15.5028 0 15.5 0 15.5C0 15.5 0.0881032 15.5002 0.249635 15.5041C1.67523 15.5162 8.82949 15.4205 11.875 12.375C15.2658 8.98416 15 0.5 15 0.5C15 0.5 15.4754 8.47535 18.75 11.75C22.0246 15.0246 30 15.5 30 15.5Z' />
                </svg>
                <span className='capitalize text-gray-700'>
                  Customer Satisfaction
                </span>
              </li>
            </ul>
          </div>
          <div className='flex-1 w-full relative '>
            <div className='w-full  '>
              <div className=' bg-secondary absolute lg:h-[140px] md:h-[140px] w-[100px] h-[90px] md:w-[180px]  bottom-[-2rem] right-[17px]   lg:right-[0px] rounded-[14px] md:-bottom-12 -z-10'></div>
              <div className='w-[50] rounded-[14px]'>
                <Image
                  src={MeetUsImage}
                  alt='meet us'
                  className='lg:h-[450px] md:w-[93%] md:h-[450px] object-cover w-[22rem] p-2 border bg-gray-50 border-gray-50  rounded-[14px] '
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
