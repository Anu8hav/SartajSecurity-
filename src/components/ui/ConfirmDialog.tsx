"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDesctructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isDesctructive = true,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border p-6 md:p-8 w-full max-w-md shadow-2xl">
        <h3 className={`font-[family-name:var(--font-headline)] text-xl mb-4 ${isDesctructive ? "text-red-500" : "text-gold"}`}>
          {title}
        </h3>
        <p className="text-muted text-sm mb-6 whitespace-pre-wrap">
          {description}
        </p>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onCancel}
          >
            CANCEL
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={onConfirm}
            className={isDesctructive ? "bg-red-500 hover:bg-red-600 text-white" : ""}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  );
}