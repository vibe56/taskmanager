const express    = require("express");
const cors       = require("cors");
const path       = require("path");
const taskRoutes = require("./routes/tasks");

// Make sure the db folder exists before the database module tries to write there
const fs = require("fs");
fs.mkdirSync(path.join(__dirname, "db"), { recursive: true });

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Simple request logger (dev only)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString().slice(11, 19)}  ${req.method.padEnd(7)} ${req.url}`);
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date() }));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  API running at http://localhost:${PORT}`);
  console.log(`📋  Health check: http://localhost:${PORT}/health\n`);
});
