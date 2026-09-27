import { apiFetch } from "../api/fetch";

const classTemplateService = {
  // تمپلیت‌ها
  getAll: () => apiFetch("/api/classTemplate"),
  
  getById: (id) => apiFetch(`/api/classTemplate/${id}`),
  
  create: (data) => apiFetch("/api/classTemplate", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiFetch(`/api/classTemplate/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  
  remove: (id) => apiFetch(`/api/classTemplate/${id}`, {
    method: "DELETE",
  }),

  // کلاس‌های تولید شده (از generated-class)
  getGeneratedClassesByDate: (date) => apiFetch(`/api/generated-class/date/${date}`),
  
  getGeneratedClassesByRange: (startDate, endDate) => 
    apiFetch(`/api/generated-class/range?startDate=${startDate}&endDate=${endDate}`),
  
  markAttendance: (id, attended, hoursTaught, notes) => 
    apiFetch(`/api/generated-class/${id}/attendance`, {
      method: "PUT",
      body: JSON.stringify({ attended, hoursTaught, notes }),
    }),
  
  getClassStats: (startDate, endDate, period) => {
    let url = "/api/generated-class/stats";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (period) params.append("period", period);
    if (params.toString()) url += `?${params.toString()}`;
    return apiFetch(url);
  },
};

export default classTemplateService;