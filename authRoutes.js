const express = require("express");
const User = require("../models/User");
const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already exists" });

    const user = new User({ name, email, username, password });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      userId: user._id,
      username: user.username,
      profilePhoto: user.profilePhoto || ""
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;
