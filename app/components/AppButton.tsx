import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
}

const AppButton = ({ children, href = "#" }: Props) => {
  return (
    <Button className="rounded-[3px] cursor-pointer px-6 py-5">
      <Link
        href={href}
        className="font-bold line uppercase tracking-wide text-nowrap"
      >
        {children}
      </Link>
    </Button>
  );
};

export default AppButton;
