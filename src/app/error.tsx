"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-bg px-6">
      <div className="text-center space-y-6">
        <h2 className="font-[family-name:var(--font-headline)] text-4xl mb-4 text-red-500">
          SYSTEM ERROR ENCOUNTERED
        </h2>
        <p className="text-muted max-w-md mx-auto">
          An unexpected anomaly occurred during operation. Please retry the process.
        </p>
        <Button variant="outline" onClick={() => reset()}>
          REBOOT PROCESS
        </Button>
      </div>
    </div>
  );
}