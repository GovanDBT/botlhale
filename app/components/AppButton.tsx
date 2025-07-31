// app/components/LinkButton.tsx
// Custom link button to navigate users to different pages
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
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
  className,
  icon = false,
  variant = "default",
  onClick,
}: Props) => {
  return (
    <Button
      className={
        "cursor-pointer hover:bg-primary-darker transition ease-in !px-5 font-bold group " +
        className
      }
      variant={variant}
      onClick={onClick}
    >
      <span className="text-base sm:text-sm text-nowrap tracking-wide !gap-1">
        {children}
      </span>
      {icon && (
        <ChevronRight className="transition duration-300 ease-in-out group-hover:translate-x-0.5" />
      )}
    </Button>
  );
};

export default AppButton;
