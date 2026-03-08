import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {v2 as cloudinary } from 'cloudinary';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export async function uploadToCloudinary(file: File) {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream({ resource_type: 'image', folder:"dev_events" }, (error, result) => {
//           if (error) {
//               reject(error);
//           }
//           resolve(result);
//       }).end(buffer);
//   })
//   return (uploadResult as {secure_url: string}).secure_url;

// }