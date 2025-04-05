// multer-config.js
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car_dealer',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `${timestamp}-${file.originalname.split('.')[0]}`;
    }
  }
});

module.exports = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
