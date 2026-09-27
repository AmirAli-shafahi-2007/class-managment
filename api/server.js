import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "config.env") });

// اتصال به دیتابیس
mongoose
  .connect(process.env.DATA_BASE)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database failed:", err));

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// احراز هویت سوکت
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("احراز هویت نشده"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("توکن نامعتبر"));
  }
});

io.on("connection", (socket) => {
  console.log(`✅ user connect : ${socket.userId}`);
  socket.join(`user:${socket.userId}`);

  socket.on("disconnect", () => {
    console.log(`❌ user disconnect : ${socket.userId}`);
  });
});

// تابع ارسال نوتیفیکیشن
export const sendNotification = (userId, notification) => {
  io.to(`user:${userId}`).emit("notification", notification);
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with WebSocket`);
});
