// 📁 src/api/fetch.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // اضافه کردن Token
  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }

  // اضافه کردن userId در هدر
  if (user && user !== "null" && user !== "undefined") {
    try {
      const parsed = JSON.parse(user);
      if (parsed._id) {
        headers["x-user-id"] = parsed._id;
      }
    } catch (e) {
      // بی‌خیال
    }
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: "Invalid JSON response" };
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};