const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const multer = require("./multer-config");
const User = require("./DB/User");
const Product = require("./DB/Product");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(express.json());
const allowedOrigins = [
  "https://final-testing-adminpage.vercel.app",
  "https://www.thevaluedrive.in",
  "https://thevaluedrive.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Database Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Database connected"))
.catch((err) => console.error("Database connection error:", err));

// User Routes
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    const result = await user.save();

    res.status(201).send({
      message: "User registered successfully",
      user: { id: result._id, name: result.name, email: result.email },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ result: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ result: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ result: "Invalid credentials" });
    }

    res.status(200).send({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Server error" });
  }
});

// Product Routes
app.post("/add", multer.array("images", 20), async (req, res) => {
  try {
    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image required" });
    }

    // Validate required fields
    const requiredFields = ['company', 'model', 'car_number'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

// Validate car number format
const carNumberRegex = /^[A-Z]{2}[0-9]{2}$/i;
if (!carNumberRegex.test(req.body.car_number)) {
  return res.status(400).json({ 
    error: "Invalid car number format. Example: CG04 or TL04" 
  });
}


    // Check if car number already exists
    // const existingProduct = await Product.findOne({ car_number: req.body.car_number });
    // if (existingProduct) {
    //   return res.status(400).json({ 
    //     error: "Car with this number already exists" 
    //   });
    // }

    // Upload images to Cloudinary
    const imageUploads = req.files.map(file => {
      return cloudinary.uploader.upload(file.path);
    });
    const uploadedImages = await Promise.all(imageUploads);
    const imageUrls = uploadedImages.map(img => img.secure_url);

    // Create new product
    const product = new Product({
      ...req.body,
      images: imageUrls
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Car number must be unique" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/product", async (req, res) => {
  try {
    const { 
      condition, 
      registrationStatus,
      minPrice,
      maxPrice,
      company,
      bodyType,
      car_number
    } = req.query;

    let query = {};
    
    if (condition) query.condition = condition;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (minPrice && maxPrice) query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    if (company) query.company = { $regex: new RegExp(company, "i") };
    if (bodyType) query.bodyType = bodyType;
    if (car_number) query.car_number = { $regex: new RegExp(car_number, "i") };

    const products = await Product.find(query);
    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ result: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ error: error.message });
  }
});

app.delete('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.images?.length > 0) {
      await Promise.all(
        product.images.map(async (imageUrl) => {
          try {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error('Error deleting image:', imageUrl, error);
          }
        })
      );
    }

    // Delete from database
    // const result = await Product.deleteOne({ _id: req.params.id });

    // res.status(200).json({
    //   success: true,
    //   message: 'Product and associated images deleted successfully',
    //   deletedCount: result.deletedCount
    // });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion',
      error: error.message
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ result: "No Record Found." });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ error: error.message });
  }
});

app.put("/product/:id", multer.array("images", 20), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    
    // Extract all fields from the form data
    const fields = [
      'company', 'model', 'color', 'distanceCovered', 'modelYear',
      'price', 'bodyType', 'condition', 'fuelType', 'registrationStatus',
      'registrationYear', 'transmissionType', 'variant', 'car_number'
    ];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

// Validate car number if being updated
if (updateData.car_number) {
  const carNumberRegex = /^[A-Z]{2}[0-9]{2}$/i;
  if (!carNumberRegex.test(updateData.car_number)) {
    return res.status(400).json({ 
      error: "Invalid car number format. Example: CG04, TL04, MH12" 
    });
  }

      // Check if car number already exists for another product
      // const existingProduct = await Product.findOne({
      //   car_number: updateData.car_number,
      //   _id: { $ne: id }
      // });
      // if (existingProduct) {
      //   return res.status(400).json({ 
      //     error: "Car with this number already exists" 
      //   });
      // }
    }

    // Handle image deletions
    const imagesToDelete = req.body.imagesToDelete ? JSON.parse(req.body.imagesToDelete) : [];
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (imageUrl) => {
          try {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error(`Error deleting image ${imageUrl}:`, err);
          }
        })
      );

      const currentProduct = await Product.findById(id);
      updateData.images = currentProduct.images.filter(
        img => !imagesToDelete.includes(img)
      );
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = req.files.map(file => {
        return cloudinary.uploader.upload(file.path);
      });
      const uploadedImages = await Promise.all(imageUploads);
      const newImageUrls = uploadedImages.map(img => img.secure_url);
      updateData.images = [...(updateData.images || []), ...newImageUrls];
    }

    const result = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ 
      success: true,
      message: "Product updated successfully",
      product: result 
    });
  } catch (error) {
    console.error("Update error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "Car number must be unique",
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Failed to update product",
      error: error.message 
    });
  }
});

app.get("/search/:key", async (req, res) => {
  try {
    const searchKey = req.params.key;
    const { 
      condition,
      registrationStatus,
      minPrice,
      maxPrice,
      company,
      bodyType,
      fuelType,
      car_number
    } = req.query;

    let query = {};
    
    if (searchKey) {
      query.$or = [
        { company: { $regex: searchKey, $options: "i" } },
        { model: { $regex: searchKey, $options: "i" } },
        { variant: { $regex: searchKey, $options: "i" } },
        { car_number: { $regex: searchKey, $options: "i" } }
      ];
    }

    if (car_number) query.car_number = { $regex: new RegExp(car_number, "i") };
    if (condition) query.condition = condition;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (minPrice && maxPrice) query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    if (company) query.company = company;
    if (bodyType) query.bodyType = bodyType;
    if (fuelType) query.fuelType = fuelType;

    const products = await Product.find(query);

    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ result: "No products found" });
    }
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/productlist", async (req, res) => {
  try {
    const { 
      company, 
      bodyType,
      condition,
      registrationStatus,
      minPrice,
      maxPrice,
      car_number
    } = req.query;

    let query = {};
    if (company) query.company = { $regex: new RegExp(company, "i") };
    if (bodyType) query.bodyType = bodyType;
    if (condition) query.condition = condition;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (minPrice && maxPrice) query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    if (car_number) query.car_number = { $regex: new RegExp(car_number, "i") };

    const products = await Product.find(query).limit(4);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Password Reset Routes
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You requested a password reset.\n\nClick the link below to reset your password:\nhttp://localhost:3000/reset-password/${token}\n\nIf you did not request this, please ignore this email.\n`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error sending email" });
      }
      res.status(200).json({ success: true, message: "Password reset link sent to your email." });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully." });
});

// Server Startup
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));