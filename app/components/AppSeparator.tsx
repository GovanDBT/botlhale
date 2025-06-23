import { Separator } from "@/components/ui/separator";

interface Props {
  className?: string;
}

const AppSeparator = ({ className }: Props) => {
  return <Separator className={"my-4 " + className} />;
};

export default AppSeparator;
