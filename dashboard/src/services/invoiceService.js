const API_URL = "http://localhost:5000";

const invoiceService = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/invoices`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("📊 getAll invoices:", data);
      if (!res.ok) throw new Error(data.message || "خطا در دریافت صورتحساب‌ها");
      return data;
    } catch (e) {
      console.error("Response text:", text);
      throw new Error("پاسخ نامعتبر از سرور");
    }
  },

  getByCompany: async (companyId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/invoices/company/${companyId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در دریافت صورتحساب‌های شرکت");
    return res.json();
  },

  getById: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/invoices/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در دریافت صورتحساب");
    return res.json();
  },

  generateMonthly: async (year, month) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/invoices/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year, month })
    });
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("📥 generateMonthly response:", data);
      if (!res.ok) throw new Error(data.message || "خطا در تولید صورتحساب");
      return data;
    } catch (e) {
      console.error("Response text:", text);
      throw new Error("پاسخ نامعتبر از سرور");
    }
  },

  getCurrentDebt: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/invoices/debt`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در دریافت بدهی");
    return res.json();
  },
};

export default invoiceService;