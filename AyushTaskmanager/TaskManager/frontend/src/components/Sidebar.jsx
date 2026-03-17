export default function Sidebar({ filters, onFilterChange, stats }) {
  const statusLinks = [
    { label: "All Tasks",  value: "",          icon: "◈", count: stats?.total ?? 0 },
    { label: "Pending",    value: "Pending",   icon: "○", count: stats?.pending ?? 0 },
    { label: "Completed",  value: "Completed", icon: "✓", count: stats?.completed ?? 0 },
  ];

  const priorityLinks = [
    { label: "High",   value: "High",   color: "var(--high)" },
    { label: "Medium", value: "Medium", color: "var(--med)" },
    { label: "Low",    value: "Low",    color: "var(--low)" },
  ];

  const completionRate = stats
    ? Math.round((stats.completed / Math.max(stats.total, 1)) * 100)
    : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">T</div>
        <span className="logo-text">Taskhive</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Views</div>
        {statusLinks.map((item) => (
          <div
            key={item.value}
            className={`nav-item ${filters.status === item.value ? "active" : ""}`}
            onClick={() => onFilterChange((prev) => ({ ...prev, status: item.value }))}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            <span className="nav-badge">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Priority</div>
        {priorityLinks.map((item) => (
          <div
            key={item.value}
            className={`nav-item ${filters.priority === item.value ? "active" : ""}`}
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                priority: prev.priority === item.value ? "" : item.value,
              }))
            }
          >
            <span
              className="nav-icon"
              style={{ color: filters.priority === item.value ? item.color : "inherit" }}
            >
              ●
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {stats && (
        <div className="sidebar-stats">
          <div className="stat-row">
            <span className="stat-label">Progress</span>
            <span className="stat-val">{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }} />
          </div>

          {stats.overdue > 0 && (
            <div className="stat-row" style={{ marginTop: 12 }}>
              <span className="stat-label" style={{ color: "var(--high)" }}>
                ⚠ Overdue
              </span>
              <span className="stat-val" style={{ color: "var(--high)" }}>
                {stats.overdue}
              </span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
