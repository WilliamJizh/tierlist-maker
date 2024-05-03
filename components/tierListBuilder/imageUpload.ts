"use client";
import { upload } from "@vercel/blob/client";
import { v4 as uuidv4 } from "uuid";

const base64ToBlob = (base64: string) => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export const imageUpload = async (image: string) => {
  const blob = base64ToBlob(image);

  const vercelBlobItem = await upload(uuidv4(), blob, {
    access: "public",
    handleUploadUrl: "/api/image/upload",
  });

  console.log("blob", vercelBlobItem);
  if (
    process.env.NEXT_PUBLIC_VERCEL_BLOB_DOMAIN &&
    process.env.NEXT_PUBLIC_TWICPIC_DOMAIN
  ) {
    const cdnUrl = vercelBlobItem.url.replace(
      process.env.NEXT_PUBLIC_VERCEL_BLOB_DOMAIN,
      process.env.NEXT_PUBLIC_TWICPIC_DOMAIN
    );
    return cdnUrl;
  }

  return vercelBlobItem.url;
};
