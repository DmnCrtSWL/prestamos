import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');

        return {
            folder: 'prestamos-app',
            resource_type: 'auto',
            // For PDFs, we strictly request 'pdf' format. For images, we allow the detected format.
            format: isPdf ? 'pdf' : undefined,
            allowed_formats: isPdf ? ['pdf'] : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            // Add public_id suffix to ensure uniqueness and prevent overwrites (optional but good practice)
        };
    }
});

export { cloudinary, storage };
