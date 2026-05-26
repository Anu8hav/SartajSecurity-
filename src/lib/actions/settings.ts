"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateOperatorSettings(data: { smsAlerts: boolean }) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      smsAlerts: data.smsAlerts,
    },
  });

  revalidatePath("/admin/settings");
  
  return { success: true };
}