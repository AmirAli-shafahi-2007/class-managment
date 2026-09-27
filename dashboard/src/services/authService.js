import { apiFetch } from "../api/fetch";

export const loginUser = (data) => {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
// src/services/authService.js

export const registerUser = (data) => {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
