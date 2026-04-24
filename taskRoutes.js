const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

/* ADD TASK */
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to add task" });
  }
});

/* GET TASKS BY DATE */
router.get("/:userId/:date", async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.params.userId,
      date: req.params.date
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to load tasks" });
  }
});

/* DELETE TASK */
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
