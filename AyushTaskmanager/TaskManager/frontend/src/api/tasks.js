import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

export const taskApi = {
  getAll: async (params = {}) => {
    // Strip empty strings so they don't get sent as query params
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const { data } = await client.get("/tasks", { params: clean });
    return data;
  },

  getById: async (id) => {
    const { data } = await client.get(`/tasks/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await client.post("/tasks", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await client.put(`/tasks/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    await client.delete(`/tasks/${id}`);
  },

  toggle: async (id) => {
    const { data } = await client.patch(`/tasks/${id}/toggle`);
    return data;
  },

  getStats: async () => {
    const { data } = await client.get("/tasks/stats");
    return data;
  },
};
