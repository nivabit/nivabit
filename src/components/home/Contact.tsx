"use client";

import Image from "next/image";
import React, { LegacyRef, ReactEventHandler, useRef, useState } from "react";
import ContactImage from "../../../public/contact image.png";
import { Check } from "lucide-react";
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
import { sendContactForm } from "@/lib/mail_sender";
import BrandButton from "../BrandButton";

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

export function ContactForm({ services }: { services?: string[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(data: z.infer<typeof ContactSchema>) {
    setIsSubmitting(true);
    const res = await sendContactForm({
      name: `${data.firstName} ${data.lastName}`,
      subject: "Lead from contact",
      email: data.companyEmail,
      message: data.message,
      company: data.companyName,
      services,
    });
    if (res.ok) {
      toast.success("Message was sent successfully", {
        description: "Thanks for contact us, out team will contact you soon",
        dismissible: true,
        duration: 5000,
        icon: <Check className='text-primary' />,
      });

      form.setValue("companyEmail", "");
      form.setValue("companyName", "");
      form.setValue("firstName", "");
      form.setValue("lastName", "");
      form.setValue("message", "");
    }
    setIsSubmitting(false);
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
                  <Input
                    placeholder='John'
                    {...field}
                    className='p-6 w-full rounded-[8px]'
                  />
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
                    className='p-6  w-full rounded-[8px]'
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
                    className='p-6  w-full rounded-[8px]'
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
                    className='p-6  w-full rounded-[8px]'
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
                  {...field}
                  placeholder='Type your message here.'
                  className='min-h-[120px] rounded-[8px]'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <BrandButton isLoading={isSubmitting} label='Send' type='submit' />
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
        className='grid grid-cols-1 lg:grid-cols-2 items-start justify-stretch md:gap-20 gap-12 mb-28 my-[10rem] md:my-48 bg-[#FAFAFC]'
        id='contact-us'
      >
        <div className='h-full'>
          <h2 className='text-gray-gray-900 lg:text-[56px] md:text-[45px]  text-[30px] font-extrabold leading-tight capitalize text-left mb-1 font-grotesk text-primary'>
            get in touch
          </h2>
          <p className='text-gray-700 text-left first-letter:uppercase md:mb-10 mb-6'>
            Ready to take the next step? Have questions about our services?
            We&apos;re here to help. Let&apos;s start building something
            incredible together.
          </p>
          <Image
            src={ContactImage}
            alt='two people discussing'
            className='w-full md:h-[30rem] object-cover rounded-[14px]'
          />
        </div>
        <div className='text-left space-y-10'>
          <div className='space-y-4'>
            <p className='text-gray-900 font-semibold pb-3 font-grotesk'>
              Choose a Service
            </p>
            <div className='flex flex-wrap gap-x-2 lg:gap-x-4 gap-y-8'>
              {serviceList.map((service) => (
                <div key={service.index} className='pb-2'>
                  <label
                    htmlFor={String(service.index)}
                    className={`py-3 px-3 rounded-[8px] cursor-pointer capitalize ${
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
            <ContactForm
              services={serviceList.map((service) => {
                if (service.check) {
                  return service.name;
                }
                return "";
              })}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
