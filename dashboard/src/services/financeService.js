const API_URL = "http://localhost:5000";

const financeService = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/financeRecord`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  getById: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/financeRecord/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  create: async (data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/financeRecord`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || "خطا در ثبت تراکنش");
      return data;
    } catch (e) {
      console.error("Response text:", text);
      throw new Error("پاسخ نامعتبر از سرور");
    }
  },

  update: async (id, data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/financeRecord/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || "خطا در ویرایش تراکنش");
      return data;
    } catch (e) {
      console.error("Response text:", text);
      throw new Error("پاسخ نامعتبر از سرور");
    }
  },

  remove: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/financeRecord/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  downloadFile: (id) => {
    const token = localStorage.getItem("token");
    window.open(`${API_URL}/api/financeRecord/${id}/download?token=${token}`, "_blank");
  },

  deleteFile: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/financeRecord/${id}/file`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },
};

export default financeService;