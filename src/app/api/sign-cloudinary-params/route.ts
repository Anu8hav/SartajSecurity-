import cloudinary from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  // Only allow authenticated admins to sign uploads
  const { userId } = await auth();
  const adminId = process.env.ADMIN_USER_ID;

  if (!userId || (adminId && userId !== adminId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({ signature });
}
