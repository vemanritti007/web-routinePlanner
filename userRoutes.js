const express = require("express");
const User = require("../models/User");
const router = express.Router();

/* =========================
   GET USER PROFILE
========================= */
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching profile for:", req.params.id);

    const user = await User.findById(req.params.id).select(
      "name email username profilePhoto"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

/* =========================
   UPDATE USER PROFILE
========================= */
router.put("/:id", async (req, res) => {
  try {
    console.log("Profile update request:", req.body);

    const { name, email, username, profilePhoto } = req.body;

    const updateData = {
      name,
      email,
      username
    };

    // Only update photo if it is base64
    if (profilePhoto && profilePhoto.startsWith("data:image")) {
      updateData.profilePhoto = profilePhoto;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("name email username profilePhoto");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile updated successfully");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;
