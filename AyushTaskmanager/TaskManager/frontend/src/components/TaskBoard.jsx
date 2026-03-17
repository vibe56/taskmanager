import TaskCard from "./TaskCard";

function SkeletonCards() {
  return (
    <div className="task-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton skeleton-card" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="board-empty">
      <div className="empty-icon">{hasFilters ? "🔍" : "📋"}</div>
      <h3>{hasFilters ? "No matching tasks" : "Nothing here yet"}</h3>
      <p>
        {hasFilters
          ? "Try adjusting your filters or search term."
          : "Create your first task using the button above."}
      </p>
    </div>
  );
}

export default function TaskBoard({ tasks, loading, error, onEdit, onDelete, onToggle, filters }) {
  if (loading) return <div className="board"><SkeletonCards /></div>;

  if (error) {
    return (
      <div className="board">
        <div className="board-empty">
          <div className="empty-icon">⚠️</div>
          <h3>Connection failed</h3>
          <p style={{ color: "var(--high)" }}>{error}</p>
        </div>
      </div>
    );
  }

  const hasFilters = !!(filters?.status || filters?.priority || filters?.search);

  return (
    <div className="board">
      {tasks.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
