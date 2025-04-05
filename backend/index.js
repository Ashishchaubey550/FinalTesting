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

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  "https://final-testing-adminpage.vercel.app",
  "https://www.thevaluedrive.in",
  "https://thevaluedrive.in"
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

// User Routes (Unchanged)
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


// same ouput for image
app.get("/product", async (req, res) => {
  const products = await Product.find();
  console.log("Sample Product:", products[0]); // Check URLs in logs
  res.send(products);
});


// Modified Product Creation with Cloudinary
// Product Routes
// Backend: Add validation before saving
app.post("/add", multer.array("images", 20), async (req, res) => {
  try {
    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image required" });
    }

    // Filter out null/undefined files
    const validFiles = req.files.filter(file => file?.path);
    
    // Get image URLs
    const imageUrls = validFiles.map(file => file.secure_url);

    const product = new Product({
      ...req.body,
      images: imageUrls
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Rest of Product Routes (Unchanged)
app.get("/product", async (req, res) => {
  try {
    const { 
      condition, 
      registrationStatus,
      minPrice,
      maxPrice,
      company,
      bodyType
    } = req.query;

    let query = {};
    
    if (condition) query.condition = condition;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (minPrice && maxPrice) query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    if (company) query.company = { $regex: new RegExp(company, "i") };
    if (bodyType) query.bodyType = bodyType;

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
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No Record Found." });
  }
});

app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
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
      fuelType
    } = req.query;

    let query = {};
    
    if (searchKey) {
      query.$or = [
        { company: { $regex: searchKey, $options: "i" } },
        { model: { $regex: searchKey, $options: "i" } },
        { variant: { $regex: searchKey, $options: "i" } }
      ];
    }

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
      maxPrice
    } = req.query;

    let query = {};
    if (company) query.company = { $regex: new RegExp(company, "i") };
    if (bodyType) query.bodyType = bodyType;
    if (condition) query.condition = condition;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (minPrice && maxPrice) query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

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