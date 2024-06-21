"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import SideBar from "./SideBar";

export default function Navbar() {
  return (
    <div className='fixed top-0  left-0  right-0 z-50 bg-gray-50 '>
      <div className='flex justify-between items-center w-full container  '>
        <div className='flex items-center'>
          <Link href='/'>
            <Image src={Logo} alt='logo' className=' size-20 lg:size-28 ' />
          </Link>
        </div>
        <div className=' items-center gap-32 hidden md:flex'>
          <NavigationMenu className=''>
            <NavigationMenuList className='flex items-center space-x-10'>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='capitalize cursor-pointer'
                  href='/#services'
                >
                  Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='capitalize cursor-pointer'
                  href='/#portfolio'
                >
                  Portfolio
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='capitalize cursor-pointer'
                  href='/#about-us'
                >
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='capitalize cursor-pointer'
                  href='/#contact-us'
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <SideBar />
      </div>
    </div>
  );
}
