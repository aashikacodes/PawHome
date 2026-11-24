// Adds sample users and pets so the website is not empty.
// Run it once with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Pet = require("./models/Pet");
const AdoptionRequest = require("./models/AdoptionRequest");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear old data
  await AdoptionRequest.deleteMany();
  await Pet.deleteMany();
  await User.deleteMany();

  const password = await bcrypt.hash("123456", 10);
  const shelter = await User.create({ name: "Happy Paws Shelter", email: "shelter@example.com", password, role: "shelter" });
  await User.create({ name: "Demo Adopter", email: "user@example.com", password, role: "adopter" });

  const pets = [
    { name: "Bruno", species: "Dog", breed: "Labrador", age: 2, gender: "Male", location: "Noida", description: "Bruno is very friendly and loves playing fetch. Great with kids.", healthInfo: "Fully vaccinated" },
    { name: "Luna", species: "Cat", breed: "Persian", age: 1, gender: "Female", location: "Delhi", description: "Luna is calm and gentle. She likes to sleep near the window.", healthInfo: "Vaccinated and dewormed" },
    { name: "Rocky", species: "Dog", breed: "German Shepherd", age: 3, gender: "Male", location: "Ghaziabad", description: "Rocky is smart, loyal and well trained. Needs daily walks.", healthInfo: "Vaccinated, neutered" },
    { name: "Mia", species: "Cat", breed: "Indian Street Cat", age: 2, gender: "Female", location: "Noida", description: "Mia is playful and good at catching toys. Very affectionate.", healthInfo: "Vaccinated" },
    { name: "Snowy", species: "Rabbit", breed: "Angora", age: 1, gender: "Female", location: "Gurugram", description: "Snowy is a soft white rabbit who loves carrots and quiet corners.", healthInfo: "Healthy" },
    { name: "Coco", species: "Bird", breed: "Cockatiel", age: 1, gender: "Male", location: "Delhi", description: "Coco whistles in the morning and enjoys sitting on shoulders.", healthInfo: "Healthy" },
  ];

  await Pet.insertMany(pets.map((pet) => ({ ...pet, owner: shelter._id })));

  console.log("Sample data added");
  console.log("Shelter login: shelter@example.com / 123456");
  console.log("Adopter login: user@example.com / 123456");
  process.exit();
};

run().catch((error) => {
  console.log(error.message);
  process.exit(1);
});
