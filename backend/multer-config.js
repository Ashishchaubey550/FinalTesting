const multer = require('multer');
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: 'car_dealer',
    public_id: `${Date.now()}-${file.originalname}`,
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png']
  })
});

module.exports = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});