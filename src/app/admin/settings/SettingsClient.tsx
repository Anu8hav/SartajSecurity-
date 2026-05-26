"use client";

import React, { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { updateOperatorSettings } from "@/lib/actions/settings";
import { toast } from "sonner";

export default function SettingsClient({ initialSmsAlerts }: { initialSmsAlerts: boolean }) {
  const [smsAlerts, setSmsAlerts] = useState(initialSmsAlerts);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateOperatorSettings({ smsAlerts });
        toast.success("CONFIGURATION SAVED", { description: "Operator preferences updated." });
      } catch (error) {
        console.error(error);
        toast.error("UPDATE FAILED", { description: "Failed to persist configuration state." });
      }
    });
  };

  return (
    <>
      <section className="space-y-6">
        <h3 className="label-accent text-gold text-xs border-b border-border pb-2">NOTIFICATION DISPATCH</h3>
        <div className="flex items-center justify-between p-4 bg-surface border border-border">
          <div>
            <p className="font-medium">Emergency SMS Alerts</p>
            <p className="text-xs text-muted">Dispatch immediate alerts for high-priority inquiries</p>
          </div>
          <button 
            type="button"
            onClick={() => setSmsAlerts(!smsAlerts)}
            className={`w-12 h-6 relative transition-colors ${smsAlerts ? "bg-gold" : "bg-zinc-700"}`}
          >
             <div className={`absolute top-1 w-4 h-4 bg-bg transition-transform ${smsAlerts ? "right-1" : "left-1"}`} />
          </button>
        </div>
      </section>

      <div className="pt-6">
        <Button variant="primary" onClick={handleSave} disabled={isPending}>
          {isPending ? "SAVING..." : "SAVE CONFIGURATION"}
        </Button>
      </div>
    </>
  );
}