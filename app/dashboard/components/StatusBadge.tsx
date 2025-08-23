// app/dashboard/components/StatusBadge.tsx
// status badge
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const StatusBadge = ({ children }: Props) => {
  const status = String(children).toLowerCase();

  let styles = "bg-red-500/15 text-red-500 ring-red-500";
  if (status === "invited" || status === "suspended") {
    styles = "bg-amber-500/15 text-amber-500 ring-amber-500";
  } else if (status === "active") {
    styles = "bg-emerald-500/15 text-emerald-500 ring-emerald-500";
  }

  return (
    <span
      className={`capitalize text-[13px] px-4 py-0.5 md:py-1 rounded-xl font-bold flex ring-1 ${styles}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
