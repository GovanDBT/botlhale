// app/error.tsx
// Error message page when an issue occurs
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRollbar } from "@rollbar/react";
import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Track number of button clicks
  const [clickCount, setClickCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const rollbar = useRollbar();

  useEffect(() => {
    rollbar.error("System error occurred", error); // error logger service
    console.error(error);
  }, [error]);

  const handleTryAgain = () => {
    // Increment clicks
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 10) {
        setIsDisabled(true); // Disable button after 15 clicks
      }
      return newCount;
    });

    // Attempt to recover
    // if (!isDisabled) reset();
  };

  return (
    <div className="container mx-auto px-4">
      <Link href="/" className="block w-[140] pt-10">
        <Image
          src="/Strype.svg"
          alt="Strype logo"
          width={0}
          height={0}
          title="Strype Logo"
          priority
          style={{ width: "100%", height: "auto" }}
          className="hover:opacity-80 transition ease-in-out"
        />
      </Link>
      <div className="place-content-center place-items-center ">
        {/* Error image */}
        <div className="flex flex-col mb-10">
          <Image
            src="/500-error.svg"
            alt="500 error image"
            width={300}
            height={300}
            priority
          />
          <a
            href="https://storyset.com/web"
            className="text-center text-primary text-[8px] underline"
            target="_blank"
          >
            Web illustrations by Storyset
          </a>
        </div>
        <h1 className="text-primary font-black text-2xl lg:text-4xl uppercase mb-3 text-center">
          An unexpected error occurred!
        </h1>
        <p className="text-primary text-base text-center">
          Oop! Something went wrong while trying to fetch a request
        </p>
        {/* Refresh button */}
        <div className="mt-8">
          <Button
            className="rounded-[3px] cursor-pointer py-5 font-bold uppercase tracking-wide hover:bg-primary-darker transition ease-in group !px-6"
            onClick={handleTryAgain}
            disabled={isDisabled}
          >
            {isDisabled ? "Button Disabled" : "Try again"}
            {!isDisabled && (
              <RefreshCcw
                strokeWidth={2.5}
                className="transition duration-300 ease-in-out group-hover:rotate-45"
              />
            )}
          </Button>
          {!isDisabled && (
            <p className="text-xs text-center mt-2 text-gray-400">
              {10 - clickCount} attempts remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
