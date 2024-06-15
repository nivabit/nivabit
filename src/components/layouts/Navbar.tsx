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
    <div className='flex justify-between items-center py-2 w-full '>
      <div className='flex items-center space-x-8'>
        <Link href='/'>
          <Image src={Logo} alt='logo' className=' size-32' />
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
  );
}
