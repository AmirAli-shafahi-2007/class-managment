const API_URL = "http://localhost:5000"; // آدرس سرورت رو بزار

const companyService = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/company`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
  },

  getById: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/company/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/company`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "خطا در ایجاد شرکت");
    }
    
    return response.json();
  },

  update: async (id, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/company/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "خطا در ویرایش شرکت");
    }
    
    return response.json();
  },

  remove: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/company/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
  },
};

export default companyService;