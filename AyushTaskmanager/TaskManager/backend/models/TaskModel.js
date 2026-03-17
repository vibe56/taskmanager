const { readDb, writeDb, nextId } = require("../db/database");

const TaskModel = {

  findAll({ status, priority, search, sortBy } = {}) {
    let { tasks } = readDb();

    if (status)   tasks = tasks.filter((t) => t.status === status);
    if (priority) tasks = tasks.filter((t) => t.priority === priority);
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "dueDate":
        tasks = tasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
        break;
      case "priority": {
        const rank = { High: 0, Medium: 1, Low: 2 };
        tasks = tasks.sort((a, b) => rank[a.priority] - rank[b.priority]);
        break;
      }
      case "title":
        tasks = tasks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        tasks = tasks.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return tasks;
  },

  findById(id) {
    const { tasks } = readDb();
    return tasks.find((t) => t.id === id) ?? null;
  },

  create({ title, description, dueDate, priority = "Medium" }) {
    const db = readDb();
    const maxOrder = db.tasks.length
      ? Math.max(...db.tasks.map((t) => t.sortOrder))
      : 0;

    const task = {
      id:          nextId(db.tasks),
      title:       title.trim(),
      description: description?.trim() ?? null,
      dueDate:     dueDate ?? null,
      priority,
      status:      "Pending",
      sortOrder:   maxOrder + 1,
      createdAt:   new Date().toISOString(),
    };

    db.tasks.push(task);
    writeDb(db);
    return task;
  },

  update(id, { title, description, dueDate, priority, status }) {
    const db  = readDb();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const task = db.tasks[idx];
    if (title       !== undefined) task.title       = title.trim();
    if (description !== undefined) task.description = description?.trim() ?? null;
    if (dueDate     !== undefined) task.dueDate     = dueDate ?? null;
    if (priority    !== undefined) task.priority    = priority;
    if (status      !== undefined) task.status      = status;

    db.tasks[idx] = task;
    writeDb(db);
    return task;
  },

  delete(id) {
    const db  = readDb();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    db.tasks.splice(idx, 1);
    writeDb(db);
    return true;
  },

  toggleStatus(id) {
    const db  = readDb();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    db.tasks[idx].status = db.tasks[idx].status === "Pending" ? "Completed" : "Pending";
    writeDb(db);
    return db.tasks[idx];
  },

  getStats() {
    const { tasks } = readDb();
    const today = new Date().toISOString().slice(0, 10);
    return {
      total:       tasks.length,
      pending:     tasks.filter((t) => t.status === "Pending").length,
      completed:   tasks.filter((t) => t.status === "Completed").length,
      highPriority: tasks.filter((t) => t.priority === "High" && t.status === "Pending").length,
      overdue:     tasks.filter((t) => t.dueDate && t.dueDate < today && t.status === "Pending").length,
    };
  },
};

module.exports = TaskModel;
