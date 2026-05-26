import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "Admin Dashboard | Sartaj Security",
  description: "Internal command center for Sartaj Security operations.",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const operatorName = user?.firstName 
    ? `${user.firstName.toUpperCase()}` 
    : user?.emailAddresses[0]?.emailAddress?.split("@")[0].toUpperCase() || "ADMIN";

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/50">
          <h1 className="label-accent text-xs text-muted tracking-widest">
            OPERATIONAL OVERVIEW
          </h1>
          <div className="flex items-center gap-4">
            <span className="label-accent text-[10px] text-muted">{operatorName}</span>
            <div className="w-8 h-8 bg-zinc-800 border border-border flex items-center justify-center">
              <span className="text-gold text-xs">{operatorName.charAt(0)}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
