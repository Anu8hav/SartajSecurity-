"use client";

import React, { useState, useTransition } from "react";
import Badge from "@/components/ui/Badge";
import { type InquiryStatus } from "@/lib/data";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/inquiry";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// Accept inquiries from server component
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  status: string;
  createdAt: Date;
}

export default function InquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  // We manage optimistic state locally for snappier UI
  const [inquiries, setInquiries] = useState(initialInquiries);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = (id: string, newStatus: InquiryStatus) => {
    const previousInquiries = [...inquiries];

    startTransition(async () => {
      // Optimistic update
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      
      try {
        await updateInquiryStatus(id, newStatus);
        toast.success("STATUS UPDATED", { description: `Marked as ${newStatus}` });
      } catch (error) {
        console.error("Failed to update status", error);
        // Rollback on failure
        setInquiries(previousInquiries);
        toast.error("UPDATE FAILED", {
          description: "Could not update status. Changes have been reverted.",
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const id = itemToDelete;
    setItemToDelete(null);
    
    const previousInquiries = [...inquiries];

    startTransition(async () => {
      // Optimistic update
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      
      try {
        await deleteInquiry(id);
        toast.success("INQUIRY PURGED", { description: "Record permanently deleted." });
      } catch (error) {
        console.error("Failed to delete inquiry", error);
        // Rollback on failure
        setInquiries(previousInquiries);
        toast.error("PURGE FAILED", {
          description: "Could not delete inquiry. The record has been restored.",
        });
      }
    });
  };

  const getNextStatus = (current: string): InquiryStatus => {
    if (current === "NEW") return "READ";
    if (current === "READ") return "CONTACTED";
    return "NEW";
  };

  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-headline)] text-3xl tracking-wide">
        OPERATIONAL INQUIRIES
      </h2>

      <div className="bg-surface border border-border">
        <div className="overflow-x-auto">
          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-muted label-accent">
              NO INQUIRIES FOUND
            </div>
          ) : (
            <div className="w-full text-left">
              <div className="flex border-b border-border bg-zinc-900/50">
                <div className="flex-1 px-6 py-4 label-accent text-[10px] text-muted">CLIENT</div>
                <div className="flex-1 px-6 py-4 label-accent text-[10px] text-muted">REQUIREMENT</div>
                <div className="w-32 px-6 py-4 label-accent text-[10px] text-muted">STATUS</div>
                <div className="w-24 px-6 py-4"></div>
              </div>
              <div className="divide-y divide-border">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex flex-col">
                    <div 
                      className="flex cursor-pointer hover:bg-zinc-800/20 transition-colors"
                      onClick={() => toggleExpand(inquiry.id)}
                    >
                      <div className="flex-1 px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{inquiry.name}</span>
                          <span className="text-xs text-muted">{inquiry.email}</span>
                        </div>
                      </div>
                      <div className="flex-1 px-6 py-4 text-sm flex items-center">
                        {inquiry.service
                          .split('-')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </div>
                      <div className="w-32 px-6 py-4 flex items-center">
                        <Badge status={inquiry.status as InquiryStatus} />
                      </div>
                      <div className="w-24 px-6 py-4 flex items-center justify-end">
                         <motion.svg 
                            animate={{ rotate: expandedId === inquiry.id ? 180 : 0 }}
                            className="w-5 h-5 text-muted" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedId === inquiry.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-bg/50 border-t border-border"
                        >
                          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-4">
                               <div>
                                 <h4 className="label-accent text-gold text-[10px] mb-1">MESSAGE DECRYPTION</h4>
                                 <p className="text-sm text-text bg-surface p-4 border border-border whitespace-pre-wrap">{inquiry.message}</p>
                               </div>
                               <div className="flex gap-8">
                                 <div>
                                   <h4 className="label-accent text-gold text-[10px] mb-1">REQUIREMENT</h4>
                                   <p className="text-sm">
                                     {inquiry.service
                                       .split('-')
                                       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                       .join(' ')}
                                   </p>
                                 </div>
                                 <div>
                                   <h4 className="label-accent text-gold text-[10px] mb-1">PHONE</h4>
                                   <p className="text-sm">{inquiry.phone || "NOT PROVIDED"}</p>
                                 </div>
                                 <div>
                                   <h4 className="label-accent text-gold text-[10px] mb-1">RECEIVED</h4>
                                   <p className="text-sm">{new Date(inquiry.createdAt).toLocaleString()}</p>
                                 </div>
                               </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="label-accent text-gold text-[10px] mb-1">ACTIONS</h4>
                                <button
                                  disabled={isPending}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(inquiry.id, getNextStatus(inquiry.status));
                                  }}
                                  className="bg-gold/10 text-gold border border-gold/40 px-4 py-2 text-xs label-accent hover:bg-gold hover:text-bg transition-colors disabled:opacity-50"
                                >
                                  {isPending ? "PROCESSING..." : `MARK ${getNextStatus(inquiry.status)}`}
                                </button>
                                <button
                                  disabled={isPending}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(inquiry.id);
                                  }}
                                  className="bg-red-500/10 text-red-500 border border-red-500/40 px-4 py-2 text-xs label-accent hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 mt-2"
                                >
                                  DELETE
                                </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={itemToDelete !== null}
        title="PURGE INQUIRY RECORD?"
        description="Are you sure you want to completely delete this inquiry record? This log will be permanently lost."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
        isDesctructive={true}
      />
    </div>
  );
}
