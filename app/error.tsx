// app/error.tsx
// Error message page when an issue occurs
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import AppButton from "./components/AppButton";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Track number of button clicks
  const [clickCount, setClickCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    Sentry.captureException(`System Error: ${error.message}`); // error logger service
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
          Oops! Something went wrong while trying to fetch a request
        </p>
        {/* Refresh button */}
        <div className="mt-8">
          <AppButton
            icon={RefreshCcw}
            largerBtn
            onClick={handleTryAgain}
            iconStyle="group-hover:rotate-45"
            disabled={isDisabled}
          >
            try again
          </AppButton>
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
