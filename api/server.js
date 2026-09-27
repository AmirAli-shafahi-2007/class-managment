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

// روی Vercel متغیرهای محیطی از پنل تنظیمات میان، config.env فقط برای اجرای لوکاله
if (!process.env.VERCEL) {
  dotenv.config({ path: path.join(__dirname, "config.env") });
}

// اتصال به دیتابیس با کش کردن کانکشن (ضروری برای سرورلس، وگرنه هر ریکوئست یه کانکشن جدید می‌سازه)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.DATA_BASE);
    isConnected = true;
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database failed:", err);
  }
}
connectDB();

let io = null;

// این تابع رو جای قبلیش (که export می‌شد) بذار - اگه جای دیگه‌ای import شده دست نخورده باقی می‌مونه
export const sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit("notification", notification);
  } else {
    console.warn("⚠️ Socket.IO روی Vercel در دسترس نیست، نوتیفیکیشن ارسال نشد:", notification);
  }
};

// سوکت و listen فقط وقتی اجرا میشه که روی Vercel نباشیم (یعنی لوکال یا سرور دائمی مثل Render)
if (!process.env.VERCEL) {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

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

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} with WebSocket`);
  });
}

// این خط برای Vercel لازمه تا بتونه اپ اکسپرس رو به‌عنوان تابع اجرا کنه
export default app;