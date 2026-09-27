// context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    // حذف کلاس‌های قبلی
    root.classList.remove("theme-dark", "theme-light", "theme-glass");
    root.classList.add(`theme-${themeName}`);
    
    // تنظیم متغیرهای CSS
    if (themeName === "dark") {
      root.style.setProperty("--bg-primary", "#0f172a");
      root.style.setProperty("--bg-secondary", "#1e293b");
      root.style.setProperty("--bg-card", "rgba(255, 255, 255, 0.03)");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#94a3b8");
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.08)");
      root.style.setProperty("--glass-bg", "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))");
      root.style.setProperty("--input-bg", "rgba(17,24,39,0.9)");
      root.style.setProperty("--card-shadow", "0 4px 20px rgba(0,0,0,0.2)");
      document.body.style.background = "#0f172a";
      document.body.style.color = "#f1f5f9";
    } else if (themeName === "light") {
      root.style.setProperty("--bg-primary", "#f8fafc");
      root.style.setProperty("--bg-secondary", "#ffffff");
      root.style.setProperty("--bg-card", "rgba(0, 0, 0, 0.02)");
      root.style.setProperty("--text-primary", "#1e293b");
      root.style.setProperty("--text-secondary", "#64748b");
      root.style.setProperty("--border-color", "rgba(0, 0, 0, 0.08)");
      root.style.setProperty("--glass-bg", "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))");
      root.style.setProperty("--input-bg", "rgba(0,0,0,0.04)");
      root.style.setProperty("--card-shadow", "0 4px 20px rgba(0,0,0,0.05)");
      document.body.style.background = "#f8fafc";
      document.body.style.color = "#1e293b";
    } else if (themeName === "glass") {
      root.style.setProperty("--bg-primary", "rgba(15, 23, 42, 0.85)");
      root.style.setProperty("--bg-secondary", "rgba(30, 41, 59, 0.5)");
      root.style.setProperty("--bg-card", "rgba(255, 255, 255, 0.05)");
      root.style.setProperty("--text-primary", "#f8fafc");
      root.style.setProperty("--text-secondary", "#cbd5e1");
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.15)");
      root.style.setProperty("--glass-bg", "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))");
      root.style.setProperty("--input-bg", "rgba(255,255,255,0.1)");
      root.style.setProperty("--card-shadow", "0 4px 20px rgba(0,0,0,0.3)");
      document.body.style.background = "linear-gradient(135deg, #0f172a, #1e1b4b)";
      document.body.style.color = "#f8fafc";
    }
    
    localStorage.setItem("theme", themeName);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};