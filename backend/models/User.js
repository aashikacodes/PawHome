// User model: stores both adopters and shelters
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // saved in hashed form, never plain text
    role: { type: String, enum: ["adopter", "shelter"], default: "adopter" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
