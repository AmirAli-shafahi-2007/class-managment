import { apiFetch } from "../api/fetch";

const generatedClassService = {
  // دریافت کلاس‌های یک روز
  getByDate: (date) => apiFetch(`/api/generated-class/date/${date}`),

  // دریافت کلاس‌های بازه زمانی
  getByDateRange: (startDate, endDate) => 
    apiFetch(`/api/generated-class/range?startDate=${startDate}&endDate=${endDate}`),

  // ثبت حضور یک کلاس
  markAttendance: (id, attended, hoursTaught, notes) => 
    apiFetch(`/api/generated-class/${id}/attendance`, {
      method: "PUT",
      body: JSON.stringify({ attended, hoursTaught, notes }),
    }),

  // ثبت حضور دسته‌جمعی
  markBulkAttendance: (date, classes) => 
    apiFetch("/api/generated-class/bulk-attendance", {
      method: "POST",
      body: JSON.stringify({ date, classes }),
    }),

  // آپدیت کلاس
  update: (id, data) => apiFetch(`/api/generated-class/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),

  // آمار کلاس‌ها
  getStats: (startDate, endDate, period) => {
    let url = "/api/generated-class/stats";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (period) params.append("period", period);
    if (params.toString()) url += `?${params.toString()}`;
    return apiFetch(url);
  },
};

export default generatedClassService;