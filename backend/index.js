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
  "https://www.thevaluedrive.in"
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
    credentials: true, // Enable if using cookies or authentication
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Customize if needed
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Register API
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

// Login API
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

// Add Product API with new fields
app.post("/add", multer.array("images", 20), async (req, res) => {
  const { 
    company, 
    model, 
    color, 
    variant,
    distanceCovered, 
    modelYear, 
    price,
    registrationYear, 
    fuelType,
    transmissionType,
    bodyType,
    condition,
    registrationStatus
  } = req.body;
  
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  if (!company || !model || !color || !registrationYear || !fuelType || 
      !transmissionType || !variant || !distanceCovered || !modelYear || 
      !bodyType || !price || images.length === 0 || !condition || !registrationStatus) {
    return res.status(400).send({ error: "All fields and at least one image are required." });
  }

  const product = new Product({
    company,
    model,
    color,
    registrationYear,
    fuelType,
    transmissionType,
    variant,
    distanceCovered: Number(distanceCovered),
    modelYear: Number(modelYear),
    price: Number(price),
    bodyType,
    images,
    condition,
    registrationStatus
  });

  try {
    const result = await product.save();
    res.status(201).send(result);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).send({ error: error.message });
  }
});

// Get All Products with Filtering
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

// Delete Product
app.delete('/product/:id', async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

// Get Single Product
app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No Record Found." });
  }
});

// Update Product
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

// Enhanced Search with New Filters
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

    // Add new filters
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

// Product List with Filtering
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

// Password Reset Routes (unchanged)
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

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));