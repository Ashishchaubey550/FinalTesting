const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Verify Cloudinary config
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary configuration");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car_dealer',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
    resource_type: 'auto'
  },
});

module.exports = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    allowedMimeTypes.includes(file.mimetype) 
      ? cb(null, true)
      : cb(new Error("Invalid file type. Only JPEG/PNG allowed"), false);
  }
});