const API_URL = "http://localhost:5000";

const contractService = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/contract`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در دریافت قراردادها");
    return res.json();
  },

  getById: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/contract/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در دریافت قرارداد");
    return res.json();
  },

  create: async (data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/contract`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("خطا در ایجاد قرارداد");
    return res.json();
  },

  update: async (id, data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/contract/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("خطا در ویرایش قرارداد");
    return res.json();
  },

  remove: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/contract/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در حذف قرارداد");
    return res.json();
  },

  downloadFile: (id) => {
    const token = localStorage.getItem("token");
    window.open(`${API_URL}/api/contract/${id}/download?token=${token}`, "_blank");
  },

  deleteFile: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/contract/${id}/file`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در حذف فایل");
    return res.json();
  },
};

export default contractService;