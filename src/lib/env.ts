export function validateEnv() {
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "NEXT_PUBLIC_CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    "RESEND_API_KEY",
    "ADMIN_EMAIL",
    "ADMIN_USER_ID",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`CRITICAL: Missing environment variable: ${envVar}`);
    }
  }
}

// Call it immediately during import
validateEnv();
