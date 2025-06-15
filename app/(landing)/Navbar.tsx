"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import AppButton from "../components/AppButton";

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  return (
    <nav className="flex justify-between items-center py-5">
      <Link href="/">
        <Image src="/Strype.svg" alt="Strype logo" width={220} height={220} />
      </Link>
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="space-x-10">
          <NavigationMenuItem className="px-5">
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className={`${
                  pathname === "/" && "font-bold text-primary"
                } hover:text-primary`}
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium">
                        shadcn/ui
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Beautifully designed components built with Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <Link href="#">
                    <span className="block font-bold">Introduction</span>
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <span className="block font-bold">Introduction</span>
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <span className="block font-bold">Introduction</span>
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="#">Solutions</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="#">Pricing</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/register"
                className={`${
                  pathname === "/register" && "font-bold text-primary"
                } hover:text-primary`}
              >
                Register school
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <AppButton href="/login">Login</AppButton>
    </nav>
  );
};

export default Navbar;
