"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import { useRef, useState } from "react";

export default function SideBar() {
  const [hideMenu, setHideMenu] = useState(false);
  const openSidebar = () => {
    setHideMenu(false);
    const body = window.document.querySelector("body");
    if (body) {
      body.classList.add("fixed", "overflow-y-hidden");
    }
  };
  const hideSidebar = () => {
    setHideMenu(true);
    const body = window.document.querySelector("body");
    if (body) {
      body.classList.remove("fixed", "overflow-y-hidden");
    }
  };
  return (
    <div className='md:hidden flex'>
      <Button
        className='inline-block rounded-md hover:bg-primary hover:opacity-80'
        onClick={openSidebar}
      >
        <span className=' sr-only'>Open menu</span>
        <MenuIcon />
      </Button>

      <div
        className={`fixed top-0 left-0 bottom-0 right-0 transition-transform  duration-300 bg-black/70 z-50 ${
          hideMenu ? "hidden" : "block"
        }`}
        onClick={hideSidebar}
      >
        <aside
          id='default-sidebar'
          className='absolute top-0 bottom-0 left-0 z-40 -translate-x-full sm:translate-x-0 '
          aria-label='Sidebar'
        >
          <NavigationMenu className='h-screen absolute top-0 bottom-0 left-0 px-3 py-4 overflow-y-auto  bg-primary items-start'>
            <NavigationMenuList className='space-y-2 font-medium flex-col w-64'>
              <NavigationMenuItem className='flex items-center p-2 text-gray-50 rounded-lg hover:bg-primary/80'>
                <NavigationMenuLink
                  className='capitalize cursor-pointer flex-1 ms-3 whitespace-nowrap '
                  href='/#services'
                  onClick={hideSidebar}
                >
                  Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className='flex items-center p-2 text-gray-50 rounded-lg hover:bg-primary/80'>
                <NavigationMenuLink
                  className='capitalize cursor-pointer flex-1 ms-3 whitespace-nowrap '
                  href='/#portfolio'
                  onClick={hideSidebar}
                >
                  Portfolio
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className='flex items-center p-2 text-gray-50 rounded-lg  hover:bg-primary/80'>
                <NavigationMenuLink
                  className='capitalize cursor-pointer flex-1 ms-3 whitespace-nowrap'
                  href='/#about-us'
                  onClick={hideSidebar}
                >
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className='flex items-center p-2 text-gray-50 rounded-lg hover:bg-primary/80'>
                <NavigationMenuLink
                  className='capitalize cursor-pointer flex-1 ms-3 whitespace-nowrap '
                  href='/#contact-us'
                  onClick={hideSidebar}
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </aside>
      </div>
    </div>
  );
}
