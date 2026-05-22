import React from "react";
import { getInquiries } from "@/lib/actions/inquiry";
import InquiriesClient from "./InquiriesClient";

export default async function AdminInquiriesPage() {
  const result = await getInquiries();
  return <InquiriesClient initialInquiries={result.data} />;
}
