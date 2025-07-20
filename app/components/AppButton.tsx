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
      className={"cursor-pointer " + className}
      type={type}
      variant={variant}
      asChild
      data-layout-button
    >
      <Link href={href} className="text-nowrap">
        {children}
      </Link>
    </Button>
  );
};

export default AppButton;
