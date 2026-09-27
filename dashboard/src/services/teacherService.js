import { apiFetch } from "../api/fetch";

const teacherService = {
  getAll: async () => apiFetch("/api/teacher"),

  getById: async (id) => apiFetch(`/api/teacher/${id}`),

  create: async (data) =>
    apiFetch("/api/teacher", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id, data) =>
    apiFetch(`/api/teacher/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: async (id) =>
    apiFetch(`/api/teacher/${id}`, {
      method: "DELETE",
    }),
};

export default teacherService;
