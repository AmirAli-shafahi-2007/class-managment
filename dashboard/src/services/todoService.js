import { apiFetch } from "../api/fetch";

const todoService = {
  getAll: async () => apiFetch("/api/todo"),

  getById: async (id) => apiFetch(`/api/todo/${id}`),

  create: async (data) =>
    apiFetch("/api/todo", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id, data) =>
    apiFetch(`/api/todo/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: async (id) =>
    apiFetch(`/api/todo/${id}`, {
      method: "DELETE",
    }),
};

export default todoService;
