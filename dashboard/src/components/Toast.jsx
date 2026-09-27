import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const toastTypes = {
  success: {
    icon: <CheckCircle size={20} />,
    bgColor: "bg-gradient-to-r from-green-600 to-emerald-600",
    borderColor: "border-green-500",
    textColor: "text-white"
  },
  error: {
    icon: <XCircle size={20} />,
    bgColor: "bg-gradient-to-r from-red-600 to-rose-600",
    borderColor: "border-red-500",
    textColor: "text-white"
  },
  warning: {
    icon: <AlertCircle size={20} />,
    bgColor: "bg-gradient-to-r from-yellow-600 to-orange-600",
    borderColor: "border-yellow-500",
    textColor: "text-white"
  },
  info: {
    icon: <Info size={20} />,
    bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600",
    borderColor: "border-blue-500",
    textColor: "text-white"
  }
};

let toastId = 0;
let listeners = [];

const addToast = (message, type = "info", duration = 3000) => {
  const id = ++toastId;
  const toast = { id, message, type, duration };
  listeners.forEach(listener => listener(toast));
  return id;
};

const removeToast = (id) => {
  listeners.forEach(listener => listener({ id, remove: true }));
};

export const toast = {
  success: (message, duration) => addToast(message, "success", duration),
  error: (message, duration) => addToast(message, "error", duration),
  warning: (message, duration) => addToast(message, "warning", duration),
  info: (message, duration) => addToast(message, "info", duration)
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
      }
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter(l => l !== handler);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => {
        const config = toastTypes[toast.type];
        return (
          <div
            key={toast.id}
            className={`min-w-[320px] max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-in-right ${config.bgColor} border ${config.borderColor}`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="text-white">
                  {config.icon}
                </div>
                <p className={`text-sm font-medium ${config.textColor}`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/70 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="h-1 bg-white/20">
              <div 
                className="h-full bg-white/40 transition-all duration-[3000ms] linear"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}