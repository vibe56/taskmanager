import { useState, useEffect } from "react";

const defaultForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "Pending",
};

export default function TaskForm({ task, onSubmit, onClose }) {
  const [form, setForm]       = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]   = useState({});
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title ?? "",
        description: task.description ?? "",
        dueDate:     task.dueDate ? task.dueDate.slice(0, 10) : "",
        priority:    task.priority ?? "Medium",
        status:      task.status ?? "Pending",
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [task]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.title.trim().length > 200) e.title = "Title must be under 200 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const payload = {
        title:       form.title.trim(),
        description: form.description.trim() || null,
        dueDate:     form.dueDate || null,
        priority:    form.priority,
        ...(isEditing ? { status: form.status } : {}),
      };
      await onSubmit(payload);
    } catch {
      // bubble handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div className="overlay" onClick={handleBackdropClick} />
      <div className="drawer">
        <div className="drawer-header">
          <h2 className="drawer-title">{isEditing ? "Edit Task" : "New Task"}</h2>
          <button className="icon-btn" onClick={onClose} title="Close">✕</button>
        </div>

        <div className="drawer-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set("title")}
              autoFocus
            />
            {errors.title && (
              <span style={{ fontSize: 12, color: "var(--high)", marginTop: 4, display: "block" }}>
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Add more detail (optional)"
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={set("dueDate")}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Priority</label>
              <div style={{ position: "relative" }}>
                <select className="form-select" value={form.priority} onChange={set("priority")}>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Status</label>
              <div style={{ position: "relative" }}>
                <select className="form-select" value={form.status} onChange={set("status")}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </>
  );
}
