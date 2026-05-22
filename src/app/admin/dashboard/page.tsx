import React from "react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { getDashboardStats, getInquiries } from "@/lib/actions/inquiry";
import Link from "next/link";
import { InquiryStatus } from "@/lib/data";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const inquiriesResult = await getInquiries(undefined, 5);
  const recentInquiries = inquiriesResult.data;

  return (
    <div className="space-y-10">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Inquiries"
          value={stats.totalInquiries.toString()}
          trend="All time"
        />
        <StatCard
          label="New This Week"
          value={stats.newThisWeek.toString()}
          trend="Immediate attention required"
          trendUp={stats.newThisWeek > 0}
        />
        <StatCard
          label="Gallery Assets"
          value={stats.galleryItems.toString()}
        />
        <StatCard
          label="System Status"
          value="OPERATIONAL"
          trend={stats.lastUpload}
          trendUp={true}
        />
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-surface border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-headline)] text-2xl tracking-wide">
            RECENT SERVICE INQUIRIES
          </h2>
          <Link href="/admin/inquiries" className="label-accent text-gold text-[10px] border-b border-gold hover:text-gold-light hover:border-gold-light transition-colors">
            VIEW ALL LOGS
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center text-muted label-accent">
              NO RECENT INQUIRIES
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-zinc-900/50">
                  <th className="px-6 py-4 label-accent text-[10px] text-muted">CLIENT</th>
                  <th className="px-6 py-4 label-accent text-[10px] text-muted">OPERATION TYPE</th>
                  <th className="px-6 py-4 label-accent text-[10px] text-muted">DATE</th>
                  <th className="px-6 py-4 label-accent text-[10px] text-muted">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{inquiry.name}</span>
                        <span className="text-xs text-muted">{inquiry.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{inquiry.service}</td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={inquiry.status as InquiryStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
