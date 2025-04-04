// Replace existing cloudinary config with:
const cloudinary = require('cloudinary');

// Configure for v1 (compatible with multer-storage-cloudinary@3)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});