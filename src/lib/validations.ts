import { z } from "zod";

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()\-]{7,20}$/, "Please provide a valid phone number")
    .optional()
    .or(z.literal("")),
  service: z
    .string()
    .min(1, "Please select a service type"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export const galleryItemSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),
  category: z.enum(["event", "corporate", "vip", "venue"]),
  location: z.string().optional().or(z.literal("")),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL"),
  publicId: z.string().min(1, "Public ID is required"),
  assetType: z.enum(["image", "video"]).default("image"),
  featured: z.boolean().default(false),
});

export type GalleryFormData = z.infer<typeof galleryItemSchema>;
