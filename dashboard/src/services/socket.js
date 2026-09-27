import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;
let listeners = [];

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("🔌 WebSocket متصل شد");
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 WebSocket قطع شد:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ خطای اتصال:", err.message);
  });

  socket.on("notification", (notification) => {
    listeners.forEach((fn) => fn(notification));
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNotification = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((fn) => fn !== callback);
  };
};
