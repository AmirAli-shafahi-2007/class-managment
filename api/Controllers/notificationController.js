import Contract from "../Models/contractMd.js";
import Todo from "../Models/todoMd.js";
import GeneratedClass from "../Models/generatedClassMd.js";
import moment from "moment-jalaali";
import { catchAsync } from "vanta-api";

// ذخیره نوتیفیکیشن‌های خوانده شده در حافظه (برای سادگی)
// در پروژه واقعی از دیتابیس استفاده کن
let readNotifications = new Set();

export const getNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const notifications = [];

  // 1. قراردادهای در حال اتمام
  const expiringContracts = await Contract.find({
    teacher: userId,
    status: "active",
    endDate: { $gte: today, $lte: oneWeekLater }
  }).populate("company", "name");

  for (const contract of expiringContracts) {
    const daysLeft = Math.ceil((contract.endDate - now) / (1000 * 60 * 60 * 24));
    const notifId = `contract-expire-${contract._id}`;
    if (!readNotifications.has(`${userId}-${notifId}`)) {
      notifications.push({
        id: notifId,
        type: "warning",
        category: "contract",
        title: "قرارداد در حال اتمام",
        message: `قرارداد "${contract.title}" در ${daysLeft} روز دیگر به پایان می‌رسد.`,
        link: `/contract/${contract._id}`,
        date: contract.endDate,
        priority: daysLeft <= 3 ? "high" : "medium",
        isRead: false
      });
    }
  }

  // 2. تسک‌های عقب افتاده
  const overdueTodos = await Todo.find({
    teacher: userId,
    status: "pending",
    dueDate: { $lt: now, $ne: null }
  });

  for (const todo of overdueTodos) {
    const daysOverdue = Math.ceil((now - new Date(todo.dueDate)) / (1000 * 60 * 60 * 24));
    const notifId = `todo-overdue-${todo._id}`;
    if (!readNotifications.has(`${userId}-${notifId}`)) {
      notifications.push({
        id: notifId,
        type: "danger",
        category: "todo",
        title: "تسک عقب افتاده",
        message: `تسک "${todo.title}" ${daysOverdue} روز از موعد آن گذشته است.`,
        link: `/todo`,
        date: todo.dueDate,
        priority: "high",
        isRead: false
      });
    }
  }

  // 3. کلاس‌های امروز
  const todayClasses = await GeneratedClass.find({
    teacher: userId,
    date: { $gte: today, $lt: tomorrow },
    status: "pending"
  });

  for (const classItem of todayClasses) {
    const notifId = `class-today-${classItem._id}`;
    if (!readNotifications.has(`${userId}-${notifId}`)) {
      notifications.push({
        id: notifId,
        type: "info",
        category: "class",
        title: "کلاس امروز",
        message: `کلاس "${classItem.title}" امروز ساعت ${classItem.startTime} برگزار می‌شود.`,
        link: `/calendar`,
        date: classItem.date,
        priority: "high",
        isRead: false
      });
    }
  }

  // 4. کلاس‌های فردا
  const tomorrowClasses = await GeneratedClass.find({
    teacher: userId,
    date: { $gte: tomorrow, $lt: new Date(tomorrow.setDate(tomorrow.getDate() + 1)) },
    status: "pending"
  });

  for (const classItem of tomorrowClasses) {
    const notifId = `class-tomorrow-${classItem._id}`;
    if (!readNotifications.has(`${userId}-${notifId}`)) {
      notifications.push({
        id: notifId,
        type: "info",
        category: "class",
        title: "کلاس فردا",
        message: `کلاس "${classItem.title}" فردا ساعت ${classItem.startTime} برگزار می‌شود.`,
        link: `/calendar`,
        date: classItem.date,
        priority: "medium",
        isRead: false
      });
    }
  }

  // 5. تسک‌های نزدیک
  const upcomingTodos = await Todo.find({
    teacher: userId,
    status: "pending",
    dueDate: { $gte: now, $lte: twoDaysLater, $ne: null }
  });

  for (const todo of upcomingTodos) {
    const daysLeft = Math.ceil((new Date(todo.dueDate) - now) / (1000 * 60 * 60 * 24));
    const notifId = `todo-upcoming-${todo._id}`;
    if (!readNotifications.has(`${userId}-${notifId}`)) {
      notifications.push({
        id: notifId,
        type: "warning",
        category: "todo",
        title: "موعد تسک نزدیک است",
        message: `تسک "${todo.title}" در ${daysLeft} روز آینده باید انجام شود.`,
        link: `/todo`,
        date: todo.dueDate,
        priority: daysLeft <= 1 ? "high" : "medium",
        isRead: false
      });
    }
  }

  // 6. قراردادهای جدید
  const newContracts = await Contract.find({
    teacher: userId,
    status: "active",
    createdAt: { $gte: weekAgo }
  }).populate("company", "name");

  for (const contract of newContracts) {
    const notifId = `contract-new-${contract._id}`;
    if (!readNotifications.has(`${userId}-${notifId}`)) {
      notifications.push({
        id: notifId,
        type: "success",
        category: "contract",
        title: "قرارداد جدید",
        message: `قرارداد "${contract.title}" با ${contract.company?.name} به تازگی ثبت شده است.`,
        link: `/contract/${contract._id}`,
        date: contract.createdAt,
        priority: "low",
        isRead: false
      });
    }
  }

  // مرتب‌سازی
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  notifications.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.date) - new Date(a.date);
  });

  const stats = {
    total: notifications.length,
    high: notifications.filter(n => n.priority === "high").length,
    medium: notifications.filter(n => n.priority === "medium").length,
    low: notifications.filter(n => n.priority === "low").length,
    read: notifications.filter(n => n.isRead).length,
    unread: notifications.filter(n => !n.isRead).length
  };

  res.json({
    success: true,
    data: notifications,
    stats,
    lastChecked: new Date()
  });
});

// علامت زدن یک نوتیفیکیشن به عنوان خوانده شده
export const markAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { notificationId } = req.params;
  
  readNotifications.add(`${userId}-${notificationId}`);
  
  res.json({
    success: true,
    message: "نوتیفیکیشن به عنوان خوانده شده علامت زده شد"
  });
});

// علامت زدن همه نوتیفیکیشن‌ها به عنوان خوانده شده
export const markAllAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;
  
  // گرفتن همه نوتیفیکیشن‌های فعلی
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  // جمع‌آوری همه IDهای نوتیفیکیشن‌های ممکن
  const expiringContracts = await Contract.find({
    teacher: userId,
    status: "active",
    endDate: { $gte: today, $lte: oneWeekLater }
  });
  for (const contract of expiringContracts) {
    readNotifications.add(`${userId}-contract-expire-${contract._id}`);
  }

  const overdueTodos = await Todo.find({
    teacher: userId,
    status: "pending",
    dueDate: { $lt: now, $ne: null }
  });
  for (const todo of overdueTodos) {
    readNotifications.add(`${userId}-todo-overdue-${todo._id}`);
  }

  const todayClasses = await GeneratedClass.find({
    teacher: userId,
    date: { $gte: today, $lt: tomorrow },
    status: "pending"
  });
  for (const classItem of todayClasses) {
    readNotifications.add(`${userId}-class-today-${classItem._id}`);
  }

  const tomorrowClasses = await GeneratedClass.find({
    teacher: userId,
    date: { $gte: tomorrow, $lt: new Date(tomorrow.setDate(tomorrow.getDate() + 1)) },
    status: "pending"
  });
  for (const classItem of tomorrowClasses) {
    readNotifications.add(`${userId}-class-tomorrow-${classItem._id}`);
  }

  const upcomingTodos = await Todo.find({
    teacher: userId,
    status: "pending",
    dueDate: { $gte: now, $lte: twoDaysLater, $ne: null }
  });
  for (const todo of upcomingTodos) {
    readNotifications.add(`${userId}-todo-upcoming-${todo._id}`);
  }

  const newContracts = await Contract.find({
    teacher: userId,
    status: "active",
    createdAt: { $gte: weekAgo }
  });
  for (const contract of newContracts) {
    readNotifications.add(`${userId}-contract-new-${contract._id}`);
  }

  res.json({
    success: true,
    message: "همه نوتیفیکیشن‌ها به عنوان خوانده شده علامت زده شدند"
  });
});