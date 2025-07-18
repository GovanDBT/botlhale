"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRollbar } from "@rollbar/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const rollbar = useRollbar();
  useEffect(() => {
    rollbar.error(error); // error logger service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
