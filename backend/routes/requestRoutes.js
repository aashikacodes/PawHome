// Routes for adoption requests (applications)
const express = require("express");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
const { protect, shelterOnly, adopterOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/requests  -> adopter sends a new adoption request
router.post("/", protect, adopterOnly, async (req, res) => {
  try {
    const { petId, phone, address, message } = req.body;

    if (!petId || !phone || !address) {
      return res.status(400).json({ message: "Phone and address are required" });
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    if (pet.status === "Adopted") {
      return res.status(400).json({ message: "This pet is already adopted" });
    }

    // One user should not apply twice for the same pet
    const alreadyApplied = await AdoptionRequest.findOne({ pet: petId, adopter: req.user._id });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this pet" });
    }

    const request = await AdoptionRequest.create({
      pet: petId,
      adopter: req.user._id,
      phone,
      address,
      message,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/requests/mine  -> applications of the logged in adopter
router.get("/mine", protect, adopterOnly, async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ adopter: req.user._id })
      .populate("pet", "name species breed image") // replace the pet id with pet details
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/requests/shelter  -> applications received for the shelter's pets
router.get("/shelter", protect, shelterOnly, async (req, res) => {
  try {
    const myPets = await Pet.find({ owner: req.user._id }).select("_id");
    const petIds = myPets.map((pet) => pet._id);

    const requests = await AdoptionRequest.find({ pet: { $in: petIds } })
      .populate("pet", "name species breed")
      .populate("adopter", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/requests/:id/status  -> shelter approves or rejects an application
router.put("/:id/status", protect, shelterOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Approved or Rejected" });
    }

    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const pet = await Pet.findById(request.pet);
    if (!pet || pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This request is not for your pet" });
    }

    request.status = status;
    await request.save();

    // When one request is approved, the pet is adopted and other pending requests are rejected
    if (status === "Approved") {
      pet.status = "Adopted";
      await pet.save();
      await AdoptionRequest.updateMany(
        { pet: pet._id, _id: { $ne: request._id }, status: "Pending" },
        { status: "Rejected" }
      );
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/requests/:id  -> adopter cancels his own pending request
router.delete("/:id", protect, adopterOnly, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);
    if (!request || request.adopter.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    await request.deleteOne();
    res.json({ message: "Request cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
