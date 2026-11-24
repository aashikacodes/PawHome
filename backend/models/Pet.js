// Pet model: one document = one pet available for adoption
const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ["Dog", "Cat", "Rabbit", "Bird", "Other"], default: "Dog" },
    breed: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 }, // age in years
    gender: { type: String, enum: ["Male", "Female"], required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    healthInfo: { type: String, default: "" },
    image: { type: String, default: "" }, // link of the pet photo
    status: { type: String, enum: ["Available", "Adopted"], default: "Available" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the shelter who added it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
