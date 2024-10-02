import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import * as fs from 'node:fs/promises';

cloudinary.config({
  cloud_name: env('CLOUDINARY_CLOUD_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
});

export const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.uploader.upload(file.path, {
    folder,
  });
  await fs.unlink(file.path);
  return response.secure_url;
};
export default saveFileToCloudinary;