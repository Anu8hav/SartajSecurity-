"use client";

import React, { useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { createGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery";
import { toast } from "sonner";
import Image from "next/image";
import { Input, Select, TextArea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location?: string | null;
  description?: string | null;
  imageUrl: string;
  publicId: string;
}

const categories = [
  { value: "event", label: "Event Security" },
  { value: "corporate", label: "Corporate Guarding" },
  { value: "vip", label: "VIP Protection" },
  { value: "venue", label: "Venue Control" },
];

export default function AdminGalleryClient({ items }: { items: GalleryItem[] }) {
  const [isPending, startTransition] = useTransition();
  
  // State for the uploaded asset waiting for details
  const [pendingAsset, setPendingAsset] = useState<{
    imageUrl: string;
    publicId: string;
    assetType: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "event",
    location: "",
    description: "",
  });

  const handleUploadSuccess = (result: any) => {
    const info = result.info;
    setPendingAsset({
      imageUrl: info.secure_url,
      publicId: info.public_id,
      assetType: info.resource_type === "video" ? "video" : "image",
    });
    // Set default title based on timestamp
    setFormData((prev) => ({
      ...prev,
      title: `Upload_${new Date().getTime().toString().slice(-4)}`,
    }));
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAsset) return;

    startTransition(async () => {
      try {
        await createGalleryItem({
          title: formData.title,
          category: formData.category,
          location: formData.location,
          description: formData.description,
          imageUrl: pendingAsset.imageUrl,
          publicId: pendingAsset.publicId,
          assetType: pendingAsset.assetType,
          featured: false,
        });
        toast.success("ASSET SECURED", { description: "Item added to the public gallery." });
        setPendingAsset(null);
        setFormData({ title: "", category: "event", location: "", description: "" });
      } catch (error) {
        console.error("Failed to save gallery asset:", error);
        toast.error("UPLOAD FAILED", {
          description:
            error instanceof Error
              ? error.message
              : "Failed to save asset record.",
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Confirm deletion of tactical asset. This action is irreversible.")) return;

    startTransition(async () => {
      try {
        await deleteGalleryItem(id);
        toast.success("ASSET PURGED", { description: "Item removed from servers." });
      } catch (error) {
         toast.error("PURGE FAILED", { description: "Failed to delete asset." });
      }
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-headline)] text-3xl tracking-wide">
          GALLERY MANAGEMENT
        </h2>
        {/* We use the unsigned preset we will configure in Cloudinary */}
        <CldUploadWidget 
           signatureEndpoint="/api/sign-cloudinary-params"
           onSuccess={handleUploadSuccess}
           options={{
             styles: {
               palette: {
                 window: "#111111",
                 windowBorder: "#2A2A2A",
                 tabIcon: "#C9922A",
                 menuIcons: "#F0EDE8",
                 textDark: "#0A0A0A",
                 textLight: "#F0EDE8",
                 link: "#C9922A",
                 action: "#C9922A",
                 inactiveTabIcon: "#6B6B6B",
                 error: "#ff4444",
                 inProgress: "#C9922A",
                 complete: "#2D6A4F",
                 sourceBg: "#0A0A0A"
               }
             }
           }}
        >
          {({ open }) => (
             <button 
               onClick={() => open()}
               disabled={isPending}
               className="bg-gold text-bg px-6 py-2 label-accent text-xs hover:bg-gold-light transition-colors disabled:opacity-50"
             >
               {isPending ? "PROCESSING..." : "UPLOAD ASSET"}
             </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Details Modal */}
      {pendingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border p-6 md:p-8 w-full max-w-md shadow-2xl">
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-6 text-gold">ASSET DETAILS</h3>
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <Input
                label="Title"
                id="asset-title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Select
                label="Service Category"
                id="asset-category"
                name="category"
                options={categories}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <Input
                label="Location (Optional)"
                id="asset-location"
                name="location"
                placeholder="e.g. New Delhi, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <TextArea
                label="Description (Optional)"
                id="asset-description"
                name="description"
                placeholder="Add context for this image, operation, or location"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setPendingAsset(null)}
                  disabled={isPending}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isPending}
                >
                  {isPending ? "SAVING..." : "SAVE ASSET"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="aspect-square bg-surface border border-border group relative overflow-hidden">
            <Image 
              src={item.imageUrl} 
              alt={item.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg/90 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
              <div className="flex justify-between items-center">
                 <div>
                   <p className="label-accent text-[10px] text-gold">{categories.find(c => c.value === item.category)?.label?.toUpperCase() || item.category.toUpperCase()}</p>
                   <p className="text-sm truncate w-32">{item.title}</p>
                   {item.location && <p className="text-xs text-muted truncate w-32">{item.location}</p>}
                 </div>
                 <button 
                   disabled={isPending}
                   onClick={() => handleDelete(item.id)}
                   className="text-muted hover:text-red-500 p-2 transition-colors disabled:opacity-50"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="p-12 border border-dashed border-border flex flex-col items-center justify-center text-muted">
          <p className="label-accent text-xs">Drop additional assets here to begin tactical processing</p>
        </div>
      )}
    </div>
  );
}
