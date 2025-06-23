/**
 * This is a custom info tooltip component
 */

// Lucide icons
import { Info } from "lucide-react";
// shadcn components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  iconSize?: number;
  iconColor?: string;
  content: string;
}

const AppInfoTooltip = ({
  content,
  iconColor = "#696969",
  iconSize = 16,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info size={iconSize} color={iconColor} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AppInfoTooltip;
