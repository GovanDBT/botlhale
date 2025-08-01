// app/not-found.tsx
// 404 not found page
"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
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
          src="/404-error.svg"
          alt="500 error image"
          width={300}
          height={300}
          priority
          className="mb-10"
        />
        <h1 className="text-primary font-black text-2xl lg:text-4xl uppercase mb-3 text-center">
          The requested page could not be found
        </h1>
        <p className="text-primary text-base text-center">
          Oop! It seems the requested URL was not found on this server
        </p>
        {/* Go back button */}
        <div className="mt-8">
          <Button
            className="rounded-[3px] cursor-pointer py-5 font-bold uppercase tracking-wide hover:bg-primary-darker transition ease-in !px-6 group"
            onClick={() => router.back()}
          >
            <ArrowLeft
              strokeWidth={2.5}
              className="transition duration-300 ease-in-out group-hover:-translate-x-0.5"
            />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
