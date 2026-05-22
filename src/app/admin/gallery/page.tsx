import React from "react";
import { getGalleryItems } from "@/lib/actions/gallery";
import AdminGalleryClient from "./AdminGalleryClient";

export default async function AdminGalleryPage() {
  const result = await getGalleryItems();
  
  // Serialize Prisma Date object if necessary or just map the needed fields
  const serializedItems = result.data.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      description: item.description,
      imageUrl: item.imageUrl,
      publicId: item.publicId,
      assetType: item.assetType,
      featured: item.featured,
  }));

  return <AdminGalleryClient items={serializedItems} />;
}
