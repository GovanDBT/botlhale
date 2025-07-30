// app/components/LinkButton.tsx
// Custom link button to navigate users to different pages
import { Button } from "@/components/ui/button";
import { ChevronRight, CircleArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  className?: string;
  icon?: boolean;
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
  icon = false,
  variant = "default",
}: Props) => {
  return (
    <Button
      className={
        "cursor-pointer hover:bg-primary-darker transition ease-in !px-5 font-bold group " +
        className
      }
      variant={variant}
      asChild
    >
      <Link
        href={href}
        className="text-base sm:text-sm text-nowrap tracking-wide !gap-1 "
      >
        {children}
        {icon && (
          <ChevronRight className="transition duration-300 ease-in-out group-hover:translate-x-0.5" />
        )}
      </Link>
    </Button>
  );
};

export default AppButton;
