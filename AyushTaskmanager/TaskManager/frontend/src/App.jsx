import { useState, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TaskBoard from "./components/TaskBoard";
import TaskForm from "./components/TaskForm";
import ToastStack, { useToast } from "./components/Toast";
import { useTasks } from "./hooks/useTasks";

export default function App() {
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("");
  const [drawer, setDrawer]   = useState(null); // null | "new" | task-object

  const { toasts, show } = useToast();

  // Build query params — debounce search client-side via useMemo
  const queryParams = useMemo(
    () => ({ ...filters, search }),
    [filters, search]
  );

  const { tasks, stats, loading, error, create, update, remove, toggle } =
    useTasks(queryParams, sortBy);

  /* ── Handlers ───────────────────────────── */
  const handleCreate = async (payload) => {
    try {
      await create(payload);
      setDrawer(null);
      show("Task created successfully");
    } catch {
      show("Failed to create task", "error");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await update(drawer.id, payload);
      setDrawer(null);
      show("Task updated");
    } catch {
      show("Failed to update task", "error");
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this task? This cannot be undone.")) return;
      try {
        await remove(id);
        show("Task deleted");
      } catch {
        show("Failed to delete task", "error");
      }
    },
    [remove, show]
  );

  const handleToggle = useCallback(
    async (id) => {
      try {
        await toggle(id);
      } catch {
        show("Could not update status", "error");
      }
    },
    [toggle, show]
  );

  const isEditing = drawer && drawer !== "new";

  return (
    <div className="app">
      <Sidebar
        filters={filters}
        onFilterChange={setFilters}
        stats={stats}
      />

      <div className="main">
        <Header
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onNewTask={() => setDrawer("new")}
        />

        <TaskBoard
          tasks={tasks}
          loading={loading}
          error={error}
          filters={{ ...filters, search }}
          onEdit={(task) => setDrawer(task)}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      </div>

      {drawer && (
        <TaskForm
          task={isEditing ? drawer : null}
          onSubmit={isEditing ? handleUpdate : handleCreate}
          onClose={() => setDrawer(null)}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
