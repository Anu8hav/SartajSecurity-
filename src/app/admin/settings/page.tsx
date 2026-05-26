import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/Input";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const operatorName = user.firstName 
    ? `${user.firstName.toUpperCase()}` 
    : user.emailAddresses[0]?.emailAddress?.split("@")[0].toUpperCase() || "ADMIN";
    
  const smsAlerts = user.publicMetadata?.smsAlerts === true;

  return (
    <div className="max-w-2xl space-y-10">
      <h2 className="font-[family-name:var(--font-headline)] text-3xl tracking-wide">
        SYSTEM CONFIGURATION
      </h2>

      <section className="space-y-6">
        <h3 className="label-accent text-gold text-xs border-b border-border pb-2">OPERATOR PROFILE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Display Name" defaultValue={operatorName} disabled />
          <Input label="Access Level" defaultValue="LEVEL-5 (OVERSIGHT)" disabled />
        </div>
      </section>

      <SettingsClient initialSmsAlerts={smsAlerts} />
    </div>
  );
}
