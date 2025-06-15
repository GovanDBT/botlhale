import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between py-5">
      <Link href="/">
        <Image
          src="/Strype-logo.svg"
          alt="Strype logo"
          width={220}
          height={220}
        />
      </Link>
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="space-x-10">
          <NavigationMenuItem className="px-5">
            <Link href="/">Home</Link>
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
          <NavigationMenuItem className="px-5">Solutions</NavigationMenuItem>
          <NavigationMenuItem className="px-5">Pricing</NavigationMenuItem>
          <NavigationMenuItem className="px-5">
            <Link href="/register">Register School</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Button>
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
