function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { label: "Due today",   overdue: false };
  if (diff === 1) return { label: "Due tomorrow", overdue: false };
  return {
    label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    overdue: false,
  };
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const isCompleted = task.status === "Completed";
  const due = formatDate(task.dueDate);

  return (
    <div className={`task-card priority-${task.priority} ${isCompleted ? "completed" : ""}`}>
      <div className="card-top">
        <div
          className={`task-checkbox ${isCompleted ? "checked" : ""}`}
          onClick={() => onToggle(task.id)}
          title={isCompleted ? "Mark as pending" : "Mark as complete"}
        >
          <span className="check-icon">✓</span>
        </div>

        <div className="card-info">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-desc">{task.description}</div>
          )}
        </div>
      </div>

      <div className="card-meta">
        <span className={`badge badge-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>

        {due && (
          <span className={`due-badge ${due.overdue ? "overdue" : ""}`}>
            📅 {due.label}
          </span>
        )}

        <div className="card-actions">
          <button
            className="icon-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏
          </button>
          <button
            className="icon-btn danger"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
