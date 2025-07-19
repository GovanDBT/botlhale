import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  className?: string;
  type?: "button" | "reset" | "submit";
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}

const AppButton = ({
  children,
  href = "",
  className,
  variant = "default",
  type = "button",
}: Props) => {
  return (
    <Button
      className={
        "rounded-[3px] cursor-pointer px-6 py-5 font-bold " + className
      }
      type={type}
      variant={variant}
      asChild
    >
      <Link href={href} className="line uppercase tracking-wide text-nowrap">
        {children}
      </Link>
    </Button>
  );
};

export default AppButton;
