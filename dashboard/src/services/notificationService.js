import { apiFetch } from "../api/fetch";

const notificationService = {
  getNotifications: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  markAsRead: async (id) => apiFetch(`/api/notifications/${id}/read`, {
    method: "PUT",
  }),

  markAllAsRead: async () => apiFetch("/api/notifications/read-all", {
    method: "PUT",
  }),

  deleteNotification: async (id) => apiFetch(`/api/notifications/${id}`, {
    method: "DELETE",
  }),
};

export default notificationService;