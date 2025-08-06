// app/not-found.tsx
// 404 not found page
"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AppButton from "./components/AppButton";

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
        <div className="flex flex-col mb-10">
          <Image
            src="/404-error.svg"
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
          The requested page could not be found
        </h1>
        <p className="text-primary text-base text-center">
          Oops! It seems the requested URL was not found on this server
        </p>
        {/* Go back button */}
        <div className="mt-8">
          <AppButton
            icon={ArrowLeft}
            iconLeft
            largerBtn
            onClick={() => router.back()}
          >
            go back
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
