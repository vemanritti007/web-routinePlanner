const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store plain text only if you don't use bcrypt (not recommended)
  profilePhoto: { type: String, default: "" } // base64 or image URL
});

module.exports = mongoose.model("User", userSchema);
