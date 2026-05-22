"use server";

import { db, getPaginatedResults } from "@/lib/db";
import { inquirySchema, type InquiryFormData } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { Inquiry } from "@prisma/client";
import "@/lib/env";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ─── Public ─────────────────────────────────────────────

export async function createInquiry(data: InquiryFormData) {
  // ── Rate Limiting ──────────────────────────────────────
  const identifier = await getClientIdentifier();

  const rateLimitResult = checkRateLimit(`inquiry:${identifier}`, {
    maxRequests: 5,
    windowSeconds: 300, // 5 requests per 5 minutes
  });

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: `Too many submissions. Please try again in ${rateLimitResult.retryAfterSeconds} seconds.`,
    };
  }

  // ── Validation ─────────────────────────────────────────
  const parsed = inquirySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        service: parsed.data.service,
        message: parsed.data.message,
        status: "NEW",
      },
    });

    // ── Email Notification (sanitized) ─────────────────
    try {
      const safeName = escapeHtml(parsed.data.name);
      const safeEmail = escapeHtml(parsed.data.email);
      const safePhone = escapeHtml(parsed.data.phone || "Not provided");
      const safeService = escapeHtml(parsed.data.service);
      const safeMessage = escapeHtml(parsed.data.message).replace(
        /\n/g,
        "<br />"
      );

      await resend.emails.send({
        from: "Sartaj Security <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL!,
        subject: `New Inquiry: ${safeService}`,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Service:</strong> ${safeService}</p>
          <hr />
          <h3>Message</h3>
          <p>${safeMessage}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // We don't fail the inquiry submission if the email fails
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/inquiries");

    return { success: true };
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}

// ─── Protected (Admin) ──────────────────────────────────

export async function getInquiries(cursor?: string, take: number = 20) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return getPaginatedResults<Inquiry>(db.inquiry, cursor, take);
}

export async function getInquiry(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.inquiry.findUnique({
    where: { id },
  });
}

export async function updateInquiryStatus(
  id: string,
  status: "NEW" | "READ" | "CONTACTED"
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.inquiry.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/inquiries");
}

export async function getDashboardStats() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [totalInquiries, newThisWeek, galleryCount] = await Promise.all([
    db.inquiry.count(),
    db.inquiry.count({
      where: { createdAt: { gte: oneWeekAgo } },
    }),
    db.galleryItem.count(),
  ]);

  const latestUpload = await db.galleryItem.findFirst({
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  let lastUpload = "No uploads yet";
  if (latestUpload) {
    const diff = Date.now() - latestUpload.createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) lastUpload = "Today";
    else if (days === 1) lastUpload = "Yesterday";
    else lastUpload = `${days} days ago`;
  }

  return {
    totalInquiries,
    newThisWeek,
    galleryItems: galleryCount,
    lastUpload,
  };
}

export async function deleteInquiry(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.inquiry.delete({
    where: { id },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/inquiries");
}
