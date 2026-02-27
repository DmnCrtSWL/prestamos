import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

import multer from 'multer';
import { Readable } from 'stream';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use memory storage instead of multer-storage-cloudinary
// due to compatibility issues with multer 2.x
const storage = multer.memoryStorage();

// Helper function to upload buffer to Cloudinary via stream
const uploadToCloudinary = (buffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const isPdf = mimetype === 'application/pdf';

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'prestamos-app',
                resource_type: 'auto',
                format: isPdf ? 'pdf' : undefined
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        // Write buffer to stream
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        stream.pipe(uploadStream);
    });
};

export { cloudinary, storage, uploadToCloudinary };
