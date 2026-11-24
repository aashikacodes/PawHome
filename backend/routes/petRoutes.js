// Routes for pets: GET (read), POST (create), PUT (update), DELETE (remove)
const express = require("express");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
const { protect, shelterOnly } = require("../middleware/auth");

const router = express.Router();

// Fields a shelter is allowed to send when adding or editing a pet
const allowedFields = [
  "name", "species", "breed", "age", "gender",
  "location", "description", "healthInfo", "image", "status",
];

// Takes only the allowed fields from the request body
const pickFields = (body) => {
  const data = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
};

// Makes search text safe to use inside a regular expression
const escapeText = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/pets  -> all pets, with optional search and filters
// Example: /api/pets?search=lab&species=Dog&gender=Male&location=delhi
router.get("/", async (req, res) => {
  try {
    const { search, species, gender, location, status } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(escapeText(search), "i"); // "i" = ignore capital/small letters
      filter.$or = [{ name: regex }, { breed: regex }];
    }
    if (species) filter.species = species;
    if (gender) filter.gender = gender;
    if (location) filter.location = new RegExp(escapeText(location), "i");
    if (status) filter.status = status;

    const pets = await Pet.find(filter).sort({ createdAt: -1 }); // newest first
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/pets/mine  -> pets added by the logged in shelter
// (This route must stay ABOVE "/:id", otherwise "mine" will be treated as an id)
router.get("/mine", protect, shelterOnly, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/pets/:id  -> one pet with full details
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("owner", "name email");
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (error) {
    res.status(400).json({ message: "Invalid pet id" });
  }
});

// POST /api/pets  -> add a new pet (shelter only)
router.post("/", protect, shelterOnly, async (req, res) => {
  try {
    const pet = await Pet.create({ ...pickFields(req.body), owner: req.user._id });
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/pets/:id  -> update a pet (only the shelter who added it)
router.put("/:id", protect, shelterOnly, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own pets" });
    }

    pet.set(pickFields(req.body));
    await pet.save();
    res.json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/pets/:id  -> delete a pet and its requests (only the owner shelter)
router.delete("/:id", protect, shelterOnly, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own pets" });
    }

    await AdoptionRequest.deleteMany({ pet: pet._id }); // remove its applications too
    await pet.deleteOne();
    res.json({ message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
