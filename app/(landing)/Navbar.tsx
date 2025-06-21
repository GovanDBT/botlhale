/**
 * This is the Navigation Menu outside the dashboard
 */
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lato } from "next/font/google"; // Google Lato font
import { CircleX, Menu } from "lucide-react"; // burger icon

// Shadcn UI
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// custom button
import AppButton from "../components/AppButton";
import { ScrollArea } from "@/components/ui/scroll-area";

// initiate Lato font
const lato = Lato({
  weight: "400",
});

const Navbar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <nav className={`flex justify-between items-center py-5 ${lato.className}`}>
      {/* Navbar logo */}
      <Link href="/">
        <Image src="/Strype.svg" alt="Strype logo" width={140} height={140} />
      </Link>
      {/* Desktop Navbar menu list */}
      <NavigationMenu viewport={false} className="hidden lg:inline-flex">
        <NavigationMenuList className="space-x-10">
          {/* Home link */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className={`${
                  pathname === "/" && "font-bold text-primary"
                } hover:text-primary text-nav-desktop`}
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* About link */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="#"
                className={`${
                  pathname === "/register" && "font-bold text-primary"
                } hover:text-primary text-nav-desktop`}
              >
                About
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* Features links */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-nav-desktop font-normal">
              Features
            </NavigationMenuTrigger>
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
          {/* Rankings links */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-nav-desktop font-normal">
              Rankings
            </NavigationMenuTrigger>
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
          {/* Statistics link */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="#"
                className={`${
                  pathname === "/register" && "font-bold text-primary"
                } hover:text-primary text-nav-desktop`}
              >
                Statistics
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* Desktop Navbar button */}
      <AppButton href="/login" className="hidden lg:inline-flex">
        Login
      </AppButton>
      {/* Mobile Navbar menu list + buttons */}
      <div className="lg:hidden">
        <Sheet>
          {/* Burger */}
          <SheetTrigger asChild>
            <Menu
              color="#576087"
              size={38}
              className="cursor-pointer hover:bg-primary/5 rounded p-1"
            />
          </SheetTrigger>
          {/* Content */}
          <SheetContent side="left" className="[&>button:first-of-type]:hidden">
            {/* Menu Lists */}
            <SheetHeader>
              <SheetTitle className="flex justify-between">
                <Image
                  src="/Strype.svg"
                  alt="Strype logo"
                  width={130}
                  height={130}
                />
                <SheetClose className="cursor-pointer">
                  <CircleX size={22} color="#576087" />
                </SheetClose>
              </SheetTitle>
            </SheetHeader>
            <div>
              <ScrollArea>
                <NavigationMenu viewport={false} className="max-w-full">
                  <div className="w-full px-4">
                    <NavigationMenuList className="flex flex-col space-y-5">
                      {/* Home Link */}
                      <NavigationMenuItem className="w-full text-center">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/"
                            className={`${
                              pathname === "/" && "font-bold text-primary"
                            } hover:text-primary text-[18px]`}
                          >
                            Home
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <Separator />
                      {/* About Link */}
                      <NavigationMenuItem className="w-full text-center">
                        <NavigationMenuLink asChild>
                          <Link
                            href="#"
                            className={`${
                              pathname === "/about" && "font-bold text-primary"
                            } hover:text-primary text-[18px]`}
                          >
                            About
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <Separator />
                      {/* Features Links */}
                      <NavigationMenuItem className="w-full text-center">
                        <NavigationMenuTrigger className="w-full hover:text-primary text-[18px] font-normal py-5.5">
                          Features
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-2">
                          <ul>
                            <li className="space-y-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature1" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Components
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature2" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Documentation
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature3" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Blocks
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <Separator />
                      {/* Rankings Links */}
                      <NavigationMenuItem className="w-full text-center">
                        <NavigationMenuTrigger className="w-full hover:text-primary text-[18px] font-normal py-5.5">
                          Rankings
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-2">
                          <ul>
                            <li className="space-y-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature1" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Components
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature2" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Documentation
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature3" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Blocks
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature3" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Blocks
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature3" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Blocks
                                </Link>
                              </NavigationMenuLink>
                              <Separator />
                              <NavigationMenuLink asChild>
                                <Link
                                  href="#"
                                  className={`${
                                    pathname === "/feature3" &&
                                    "font-bold text-primary"
                                  } hover:text-primary text-[18px]`}
                                >
                                  Blocks
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <Separator />
                      {/* Statistics Link */}
                      <NavigationMenuItem className="w-full text-center">
                        <NavigationMenuLink asChild>
                          <Link
                            href="#"
                            className={`${
                              pathname === "/statistics" &&
                              "font-bold text-primary"
                            } hover:text-primary text-[18px]`}
                          >
                            Statistics
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                </NavigationMenu>
              </ScrollArea>
            </div>
            {/* Menu Buttons */}
            <SheetFooter>
              {/* Login Button */}
              <AppButton href="/login">Login</AppButton>
              {/* Close Sheet Button */}
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="rounded-[3px] cursor-pointer px-6 py-5 font-bold uppercase tracking-wide"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
