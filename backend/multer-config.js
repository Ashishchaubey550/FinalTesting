// multer-config.js
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car_dealer',
    allowed_formats: ['jpg', 'jpeg', 'png'], // Original formats accepted
    transformation: [
      {
        fetch_format: 'webp',  // Convert to WebP
        quality: 'auto',       // Auto-optimize quality
        format: 'webp'         // Store as WebP
      }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      // Remove original extension from filename
      const filename = file.originalname.split('.').slice(0, -1).join('.');
      return `${timestamp}-${filename}`;
    },
    overwrite: false,         // Prevent overwrites
    unique_filename: true,    // Ensure unique names
    resource_type: 'auto'     // Handle both images and videos
  }
});

module.exports = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});