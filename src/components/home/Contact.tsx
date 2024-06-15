"use client";

import Image from "next/image";
import React, { ReactEventHandler, useState } from "react";
import ContactImage from "../../../public/contact image.png";
import Container from "../ui/container";
import { Textarea } from "@/components/ui/textarea";
import { services } from "./ServicesCarouselSpacing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const ContactSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .optional(),
  companyName: z
    .string()
    .min(2, { message: " Company name must be at least 2 characters" }),
  companyEmail: z.string({ message: "Company email is required" }).email(),
  message: z.string().optional(),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
  });

  function onSubmit(data: z.infer<typeof ContactSchema>) {
    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-6'>
        <div className='grid grid-cols-2 gap-3 w-full'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} className='p-6 w-full' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='invisible'>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Suleiman'
                    {...field}
                    className='p-6  w-full'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='companyName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='MicroSoft'
                    {...field}
                    className='p-6  w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='companyEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Email@company.com'
                    {...field}
                    className='p-6  w-full'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Type your message here.'
                  className='min-h-[87px]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button className='group flex items-center p-2 bg-primary text-white rounded-2xl transition duration-300'>
          <span className='mr-5 capitalize ml-8'>Send</span>
          <div className='bg-gray-50  px-4 py-3 rounded-2xl'>
            <svg
              width='18'
              height='19'
              viewBox='0 0 18 19'
              xmlns='http://www.w3.org/2000/svg'
              className='w-6 h-6 transform transition-transform duration-300 ease-in-out group-hover:rotate-45 fill-secondary'
            >
              <path d='M17.5822 13.9009V2.11089C17.5822 1.39518 17.1301 0.917856 16.3892 0.917856L4.59917 0.943035C3.90864 0.943035 3.44417 1.45786 3.44417 2.04821C3.44417 2.63804 3.97131 3.14054 4.54881 3.14054H8.29078L14.2672 2.91446L11.9819 4.92339L0.76935 16.1611C0.543814 16.3871 0.418457 16.663 0.418457 16.9271C0.418457 17.5164 0.9456 18.0821 1.5606 18.0821C1.84989 18.0821 2.11346 17.9691 2.33899 17.743L13.5767 6.50536L15.5856 4.23286L15.3595 9.94571V13.9512C15.3595 14.5287 15.862 15.0559 16.4647 15.0559C17.0545 15.0559 17.5822 14.5663 17.5822 13.9009Z' />
            </svg>
          </div>
        </button>
      </form>
    </Form>
  );
}

export default function Contact() {
  const [serviceList, setServiceList] = useState<
    { name: string; check: boolean; index: number }[]
  >(() => {
    const checklist = services.map((service, index) => {
      return { name: service, check: false, index };
    });
    return checklist;
  });

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceList((currentValue) => {
      return currentValue.map((service) => {
        if (service.index === +e.target.id) {
          return { ...service, check: e.target.checked };
        }
        return service;
      });
    });
  };
  return (
    <Container>
      <div
        className='grid grid-cols-1 lg:grid-cols-2 items-start justify-stretch gap-20 mb-28'
        id='contact-us'
      >
        <div className='h-full'>
          <h2 className='text-gray-gray-900 text-[45px] font-extrabold leading-tight capitalize text-left mb-4'>
            get in touch
          </h2>
          <p className='text-gray-700 text-left first-letter:uppercase mb-10'>
            Ready to take the next step? Have questions about our services?
            We&apos;re here to help. Let&apos;s start building something
            incredible together.
          </p>
          <Image
            src={ContactImage}
            alt='two people discussing'
            className='w-full auto object-cover rounded-2xl mt-5'
          />
        </div>
        <div className='text-left space-y-10'>
          <div className='space-y-4'>
            <p className='text-gray-900 font-semibold pb-6'>Choose a Service</p>
            <div className='flex flex-wrap gap-x-2 lg:gap-x-4 gap-y-8'>
              {serviceList.map((service) => (
                <div key={service.index}>
                  <label
                    htmlFor={String(service.index)}
                    className={`py-3 px-3 rounded-2xl cursor-pointer capitalize ${
                      service.check
                        ? "border border-transparent bg-primary text-gray-50 "
                        : "border border-gray-400 text-gray-400"
                    }`}
                  >
                    {service.name}
                  </label>
                  <input
                    type='checkbox'
                    name='services'
                    id={String(service.index)}
                    className='sr-only'
                    onChange={handleCheck}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
