"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function AdminError({
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
    <div className="flex w-full h-[50vh] flex-col items-center justify-center p-8 bg-surface border border-border">
      <div className="text-center space-y-6">
        <h2 className="font-[family-name:var(--font-headline)] text-3xl mb-4 text-red-500">
          DASHBOARD INTEGRITY FAILURE
        </h2>
        <p className="text-muted max-w-md mx-auto text-sm">
          A command center module failed to load properly. The internal state could not be resolved.
        </p>
        <Button variant="outline" onClick={() => reset()}>
          RE-INITIALIZE MODULE
        </Button>
      </div>
    </div>
  );
}