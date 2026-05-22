export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

export type InquiryStatus = "NEW" | "READ" | "CONTACTED";
export type GalleryCategory = "event" | "corporate" | "vip" | "venue";

export interface DashboardStats {
  totalInquiries: number;
  newThisWeek: number;
  galleryItems: number;
  lastUpload: string;
}
