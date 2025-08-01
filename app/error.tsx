// app/error.tsx
// Error message page when an issue occurs
"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRollbar } from "@rollbar/react";
import Image from "next/image";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const rollbar = useRollbar();

  useEffect(() => {
    rollbar.error("System error occurred", error); // error logger service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4">
      <div className="block w-[140] pt-10">
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
      </div>
      <div className="place-content-center place-items-center ">
        {/* Error image */}
        <Image
          src="/500-error.svg"
          alt="500 error image"
          width={300}
          height={300}
          priority
          className="mb-10"
        />
        <h1 className="text-primary font-black text-2xl lg:text-4xl uppercase mb-3 text-center">
          An unexpected error occurred!
        </h1>
        <p className="text-primary text-base text-center">
          Oop! Something went wrong while trying to fetch a request
        </p>
        {/* Refresh button */}
        <div className="mt-8">
          <Button
            className="rounded-[3px] cursor-pointer py-5 font-bold uppercase tracking-wide hover:bg-primary-darker transition ease-in"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
            <RefreshCcw strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
