export default function Header({ search, onSearchChange, sortBy, onSortChange, onNewTask }) {
  return (
    <header className="header">
      <span className="header-title">My Tasks</span>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="header-controls">
        <div className="select-wrap">
          <select
            className="header-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Sort: Default</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </select>
          <span className="select-caret">▼</span>
        </div>

        <button className="btn-new" onClick={onNewTask}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          New Task
        </button>
      </div>
    </header>
  );
}
