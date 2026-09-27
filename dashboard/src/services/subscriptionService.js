const API_URL = "http://localhost:5000";

const subscriptionService = {
  getInfo: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/subscription/info`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("خطا در دریافت اطلاعات اشتراک");
    return res.json();
  },

  requestPayment: async (planId) => {
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${API_URL}/api/subscription/request`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ planId })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "خطا در درخواست پرداخت");
    }
    
    if (data.success && data.paymentUrl) {
      // هدایت به صفحه پرداخت زرین‌پال
      window.location.href = data.paymentUrl;
    }
    
    return data;
  }
};

export default subscriptionService;