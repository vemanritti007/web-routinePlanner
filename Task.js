const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  text: String,
  priority: Boolean
});

module.exports = mongoose.model("Task", taskSchema);
