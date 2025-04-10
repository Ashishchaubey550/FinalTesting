const mongoose = require("mongoose");

// Define the Product schema with specific fields
const productSchema = new mongoose.Schema({
  company: { type: String, required: true }, 
  model: { type: String, required: true },   
  variant: { type: String, required: true }, 
  color: { type: String, required: true },   
  distanceCovered: { type: Number, required: true }, 
  modelYear: { type: Number, required: true },
  registrationYear: { type: Number, required: true }, 
  fuelType: { type: String, required: true }, 
  transmissionType: { type: String, required: true }, 
  bodyType: { type: String, required: true }, 
  price: { type: Number, required: true },
  car_number: { type: String, required: true },
  images: { type: [String], required: true },
  // New fields for filtering
  condition: { 
    type: String, 
    enum: ["new", "preowned"], 
    default: "new",
    required: true
  },
  registrationStatus: { 
    type: String, 
    enum: ["registered", "unregistered"], 
    default: "registered",
    required: true
  }
});

// Export the Product model
module.exports = mongoose.model("Product", productSchema);