const express  = require("express");
const router   = express.Router();
const TaskModel = require("../models/TaskModel");
const { validate, createRules, updateRules } = require("../middleware/validate");

// ── GET /api/tasks ─────────────────────────────────────────────────────────
// Query params: status, priority, search, sortBy
router.get("/", (req, res) => {
  try {
    const { status, priority, search, sortBy } = req.query;
    const tasks = TaskModel.findAll({ status, priority, search, sortBy });
    res.json(tasks);
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// ── GET /api/tasks/stats ───────────────────────────────────────────────────
// IMPORTANT: Must be declared before /:id so Express doesn't treat "stats" as an id
router.get("/stats", (req, res) => {
  try {
    const stats = TaskModel.getStats();
    res.json(stats);
  } catch (err) {
    console.error("GET /tasks/stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ── GET /api/tasks/:id ─────────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  try {
    const task = TaskModel.findById(Number(req.params.id));
    if (!task) return res.status(404).json({ message: `Task ${req.params.id} not found` });
    res.json(task);
  } catch (err) {
    console.error("GET /tasks/:id error:", err);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

// ── POST /api/tasks ────────────────────────────────────────────────────────
router.post("/", createRules, validate, (req, res) => {
  try {
    const task = TaskModel.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error("POST /tasks error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// ── PUT /api/tasks/:id ─────────────────────────────────────────────────────
router.put("/:id", updateRules, validate, (req, res) => {
  try {
    const task = TaskModel.update(Number(req.params.id), req.body);
    if (!task) return res.status(404).json({ message: `Task ${req.params.id} not found` });
    res.json(task);
  } catch (err) {
    console.error("PUT /tasks/:id error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// ── DELETE /api/tasks/:id ──────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    const deleted = TaskModel.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: `Task ${req.params.id} not found` });
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /tasks/:id error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// ── PATCH /api/tasks/:id/toggle ────────────────────────────────────────────
router.patch("/:id/toggle", (req, res) => {
  try {
    const task = TaskModel.toggleStatus(Number(req.params.id));
    if (!task) return res.status(404).json({ message: `Task ${req.params.id} not found` });
    res.json(task);
  } catch (err) {
    console.error("PATCH /tasks/:id/toggle error:", err);
    res.status(500).json({ message: "Failed to toggle status" });
  }
});

module.exports = router;
