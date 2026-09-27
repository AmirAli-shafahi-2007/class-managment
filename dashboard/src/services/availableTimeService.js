import { apiFetch } from "../api/fetch";

const availableTimeService = {
  getAll: async () => apiFetch("/api/availableTime"),

  getById: async (id) => apiFetch(`/api/availableTime/${id}`),

  create: async (data) =>
    apiFetch("/api/availableTime", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id, data) =>
    apiFetch(`/api/availableTime/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: async (id) =>
    apiFetch(`/api/availableTime/${id}`, {
      method: "DELETE",
    }),
};

export default availableTimeService;