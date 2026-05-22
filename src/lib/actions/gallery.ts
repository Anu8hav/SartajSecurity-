"use server";

import { db, getPaginatedResults } from "@/lib/db";
import { galleryItemSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { GalleryItem } from "@prisma/client";

// ─── Public ─────────────────────────────────────────────

export async function getGalleryItems(cursor?: string, take: number = 20) {
  return getPaginatedResults<GalleryItem>(db.galleryItem, cursor, take);
}

// ─── Protected (Admin) ──────────────────────────────────

export async function createGalleryItem(data: {
  title: string;
  category: string;
  location?: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  assetType?: string;
  featured?: boolean;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Validate input with Zod schema
  const parsed = galleryItemSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
  }

  await db.galleryItem.create({
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      location: parsed.data.location || null,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl,
      publicId: parsed.data.publicId,
      assetType: parsed.data.assetType || "image",
      featured: parsed.data.featured || false,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
}

export async function deleteGalleryItem(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the item first to retrieve the Cloudinary public ID
  const item = await db.galleryItem.findUnique({ where: { id } });
  if (!item) throw new Error("Gallery item not found");

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(item.publicId);
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
    // Continue with DB deletion even if Cloudinary fails
  }

  // Delete from database
  await db.galleryItem.delete({ where: { id } });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
}
