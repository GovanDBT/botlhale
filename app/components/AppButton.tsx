// app/components/LinkButton.tsx
// Custom button to navigate users to different pages
import { Button } from "@/components/ui/button";
import { ChevronRight, Icon } from "lucide-react";
import { ComponentType, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ComponentType<{ className?: string; size?: number }>;
  iconStyle?: string;
  largerBtn?: boolean;
  redirectIcon?: boolean;
  iconLeft?: boolean;
  disabled?: boolean;
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
  className,
  redirectIcon = false,
  largerBtn = false,
  iconStyle,
  variant = "default",
  type = "button",
  iconLeft,
  icon,
  onClick,
  disabled = false,
}: Props) => {
  const style = `transition duration-300 ease-in-out ${
    iconLeft ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
  } ${iconStyle}`;
  const IconComponent = icon;
  return (
    <Button
      className={`cursor-pointer hover:bg-primary-darker transition-all ease-in-out !px-5 font-bold group ${
        largerBtn ? "uppercase rounded-[3px] py-5" : "capitalize"
      } ${className}`}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {IconComponent && iconLeft && (
        <IconComponent className={style} size={10} />
      )}
      <span className="text-base sm:text-sm text-nowrap tracking-wide !gap-1">
        {children}
      </span>
      {IconComponent && !iconLeft && (
        <IconComponent className={style} size={10} />
      )}
      {redirectIcon && <ChevronRight className={style} />}
    </Button>
  );
};

export default AppButton;
