"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../ui/container";
import LightLogo from "../../../public/lightLogo.svg";
import { Mail, Phone, Twitter } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export default function Navbar() {
  return (
    <div className='w-full bg-primary text-accent  py-20'>
      <Container>
        <div className='flex fle-col md:flex-row  items-start space-x-10'>
          <div className='self-center space-y-6  basis-[55%] h-full flex-1'>
            <Image src={LightLogo} alt='logo' />
            <p className='  w-3/5 text-gray-50 opacity-80  leading-relaxed'>
              Ready to take the next step? Have questions about our services?
              We&apos;re here to help. Let&apos;s start building something
              incredible together.
            </p>
            <div className='flex items-center justify-start space-x-4'>
              <Link href={"/"} className='p-3 bg-gray-50 rounded-md'>
                <svg
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='size-6 fill-secondary'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clipPath='url(#clip0_419_3572)'>
                    <path d='M7.55016 22.3957C16.6045 22.3957 21.5583 14.8925 21.5583 8.38761C21.5583 8.17668 21.5536 7.96105 21.5442 7.75011C22.5079 7.05321 23.3395 6.19001 24 5.20105C23.1025 5.60035 22.1496 5.86113 21.1739 5.97449C22.2013 5.35866 22.9705 4.39122 23.3391 3.25152C22.3726 3.82431 21.3156 4.22836 20.2134 4.44636C19.4708 3.65731 18.489 3.13487 17.4197 2.9598C16.3504 2.78474 15.2532 2.9668 14.2977 3.47785C13.3423 3.98889 12.5818 4.80046 12.1338 5.78706C11.6859 6.77367 11.5754 7.88037 11.8195 8.93605C9.86249 8.83784 7.94794 8.32946 6.19998 7.44385C4.45203 6.55824 2.90969 5.31519 1.67297 3.79527C1.0444 4.879 0.852057 6.1614 1.13503 7.38184C1.418 8.60229 2.15506 9.6692 3.19641 10.3657C2.41463 10.3409 1.64998 10.1304 0.965625 9.75167V9.81261C0.964925 10.9499 1.3581 12.0523 2.07831 12.9325C2.79852 13.8127 3.80132 14.4163 4.91625 14.6407C4.19206 14.8389 3.43198 14.8678 2.69484 14.7251C3.00945 15.7032 3.62157 16.5586 4.44577 17.1721C5.26997 17.7855 6.26512 18.1263 7.29234 18.147C5.54842 19.5169 3.39417 20.2599 1.17656 20.2564C0.783287 20.2558 0.390399 20.2317 0 20.1842C2.25286 21.6295 4.87353 22.3971 7.55016 22.3957Z' />
                  </g>
                  <defs>
                    <clipPath id='clip0_419_3572'>
                      <rect
                        className='size-6 fill-gray-50'
                        transform='translate(0 0.645508)'
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link href={"/"} className='p-3 bg-gray-50 rounded-md'>
                <svg
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='size-6 fill-secondary'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clipPath='url(#clip0_419_3574)'>
                    <path d='M24 12.6455C24 6.01809 18.6274 0.645508 12 0.645508C5.37258 0.645508 0 6.01809 0 12.6455C0 18.635 4.3882 23.5995 10.125 24.4997V16.1143H7.07812V12.6455H10.125V10.0018C10.125 6.99426 11.9166 5.33301 14.6576 5.33301C15.9701 5.33301 17.3438 5.56738 17.3438 5.56738V8.52051H15.8306C14.34 8.52051 13.875 9.44559 13.875 10.3955V12.6455H17.2031L16.6711 16.1143H13.875V24.4997C19.6118 23.5995 24 18.635 24 12.6455Z' />
                  </g>
                  <defs>
                    <clipPath id='clip0_419_3574'>
                      <rect
                        className='size-6 fill-gray-50'
                        transform='translate(0 0.645508)'
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link href={"/"} className='p-3 bg-gray-50 rounded-md'>
                <svg
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='size-6 fill-secondary rounded-sm'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clipPath='url(#clip0_419_3576)'>
                    <path d='M22.2234 0.645508H1.77187C0.792187 0.645508 0 1.41895 0 2.3752V22.9111C0 23.8674 0.792187 24.6455 1.77187 24.6455H22.2234C23.2031 24.6455 24 23.8674 24 22.9158V2.3752C24 1.41895 23.2031 0.645508 22.2234 0.645508ZM7.12031 21.0971H3.55781V9.64082H7.12031V21.0971ZM5.33906 8.07988C4.19531 8.07988 3.27188 7.15645 3.27188 6.01738C3.27188 4.87832 4.19531 3.95488 5.33906 3.95488C6.47813 3.95488 7.40156 4.87832 7.40156 6.01738C7.40156 7.15176 6.47813 8.07988 5.33906 8.07988ZM20.4516 21.0971H16.8937V15.5283C16.8937 14.2018 16.8703 12.4908 15.0422 12.4908C13.1906 12.4908 12.9094 13.9393 12.9094 15.4346V21.0971H9.35625V9.64082H12.7687V11.2064H12.8156C13.2891 10.3064 14.4516 9.35488 16.1813 9.35488C19.7859 9.35488 20.4516 11.7268 20.4516 14.8111V21.0971Z' />
                  </g>
                  <defs>
                    <clipPath id='clip0_419_3576'>
                      <rect
                        className='size-6 fill-gray-50'
                        transform='translate(0 0.645508)'
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
          </div>
          <div className='space-y-6 basis-[25%] self-center '>
            <h3 className=' capitalize font-light'>Quick Links</h3>

            <ul className='flex flex-col items-start space-y-6 justify-start '>
              <li>
                <Link
                  href='#services'
                  legacyBehavior
                  passHref
                  className='capitalize cursor-pointer'
                >
                  Service
                </Link>
              </li>
              <li>
                <Link
                  href='#portfolio'
                  legacyBehavior
                  passHref
                  className='capitalize cursor-pointer'
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href='#about-us'
                  legacyBehavior
                  passHref
                  className='capitalize cursor-pointer'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='#contact-us'
                  legacyBehavior
                  passHref
                  className='capitalize cursor-pointer'
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className='basis-[25%] self-center h-full'>
            <h3 className='capitalize font-light'>Contact us</h3>
            <p className='py-6 text-gray-50 opacity-80  leading-relaxed'>
              Ready to take the next step? Have questions about our services
            </p>
            <div className='flex flex-col items-start space-y-3'>
              <Link href='lorem' className='flex items-center space-x-4'>
                <span className='p-3 bg-gray-50 rounded-md'>
                  <Mail className='fill-secondary size-4' />
                </span>
                <span className='opacity-80 '>Groupnivabit@gmail.com</span>
              </Link>
              <Link href='lorem' className='flex items-center space-x-3'>
                <span className='p-3 bg-gray-50 rounded-md'>
                  <Phone className='fill-secondary size-4' />
                </span>
                <span className='opacity-80 '>+2349071133025</span>
              </Link>
            </div>
          </div>
        </div>
        <hr className='bg-gray-50 my-10' />
        <div className='flex flex-col md:flex-row justify-between'>
          <p className=' capitalize font-light'>
            &copy; Nivabit {new Date().getFullYear()} all right reserved
          </p>
          <div className='flex items-center space-x-6'>
            <Link href={"/"}>Privacy Policy</Link>
            <svg
              width='14'
              height='15'
              viewBox='0 0 14 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14 7.64551C14 7.64551 10.5224 8.20644 9.04167 9.68717C7.56093 11.1679 7 14.6455 7 14.6455C7 14.6455 6.90985 10.6516 5.25 9.10384C3.85792 7.80577 0.755609 7.66309 0.116496 7.64743C0.0410629 7.64679 0 7.64551 0 7.64551C0 7.64551 0.0411147 7.64559 0.116496 7.64743C0.781771 7.65308 4.12043 7.60841 5.54167 6.18717C7.12406 4.60478 7 0.645508 7 0.645508C7 0.645508 7.22183 4.36734 8.75 5.89551C10.2782 7.42368 14 7.64551 14 7.64551Z'
                fill='white'
              />
            </svg>

            <Link href={"/"}>Terms of Sercice</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
