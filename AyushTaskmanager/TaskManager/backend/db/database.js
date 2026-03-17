const fs   = require("fs");
const path = require("path");

const DB_DIR  = path.join(__dirname, "..", "db");
const DB_FILE = path.join(DB_DIR, "tasks.json");

function readDb() {
  if (!fs.existsSync(DB_FILE)) return initDb();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return initDb();
  }
}

function writeDb(data) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

function nextId(tasks) {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
}

function initDb() {
  const now  = new Date();
  const day  = (n) => new Date(now.getTime() + n * 86400000).toISOString().slice(0, 10);
  const past = (n) => new Date(now.getTime() - n * 86400000).toISOString();

  const data = {
    tasks: [
      {
        id: 1, title: "Set up development environment",
        description: "Install dependencies, configure linting, set up Git hooks and environment variables.",
        dueDate: day(1), priority: "High", status: "Completed", sortOrder: 1, createdAt: past(3),
      },
      {
        id: 2, title: "Design database schema",
        description: "Define all entities, relationships, and indexes. Review with team before implementation.",
        dueDate: day(3), priority: "High", status: "Pending", sortOrder: 2, createdAt: past(2),
      },
      {
        id: 3, title: "Implement REST API endpoints",
        description: "Build CRUD operations, add input validation, and handle edge cases properly.",
        dueDate: day(6), priority: "Medium", status: "Pending", sortOrder: 3, createdAt: past(1),
      },
      {
        id: 4, title: "Write unit and integration tests",
        description: "Aim for at least 80% code coverage. Use Jest for testing and Supertest for HTTP assertions.",
        dueDate: day(10), priority: "Medium", status: "Pending", sortOrder: 4, createdAt: now.toISOString(),
      },
      {
        id: 5, title: "Update project README",
        description: "Add setup instructions, architecture overview, and contribution guidelines.",
        dueDate: day(12), priority: "Low", status: "Pending", sortOrder: 5, createdAt: now.toISOString(),
      },
    ],
  };

  writeDb(data);
  console.log("✅  Seeded tasks.json with 5 tasks");
  return data;
}

module.exports = { readDb, writeDb, nextId };
