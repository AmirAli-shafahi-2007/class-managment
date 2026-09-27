import { apiFetch } from "../api/fetch";

const classLogService = {
  getAll: async () => apiFetch("/api/dailyClassLog"),

  getById: async (id) => apiFetch(`/api/dailyClassLog/${id}`),

  create: async (data) =>
    apiFetch("/api/dailyClassLog", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id, data) =>
    apiFetch(`/api/dailyClassLog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: async (id) =>
    apiFetch(`/api/dailyClassLog/${id}`, {
      method: "DELETE",
    }),
};

export default classLogService;
