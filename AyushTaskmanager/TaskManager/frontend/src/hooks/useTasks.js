import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../api/tasks";

export function useTasks(filters, sortBy) {
  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskData, statsData] = await Promise.all([
        taskApi.getAll({ ...filters, sortBy }),
        taskApi.getStats(),
      ]);
      setTasks(taskData);
      setStats(statsData);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Could not reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  useEffect(() => { load(); }, [load]);

  const create = async (payload) => {
    await taskApi.create(payload);
    await load();
  };

  const update = async (id, payload) => {
    await taskApi.update(id, payload);
    await load();
  };

  const remove = async (id) => {
    await taskApi.delete(id);
    await load();
  };

  const toggle = async (id) => {
    await taskApi.toggle(id);
    await load();
  };

  return { tasks, stats, loading, error, create, update, remove, toggle, refresh: load };
}
