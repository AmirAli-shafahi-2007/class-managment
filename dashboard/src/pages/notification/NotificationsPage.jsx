import { useState, useEffect } from "react";
import {
  Bell,
  AlertCircle,
  Calendar,
  FileText,
  CheckSquare,
  X,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";
import { toast } from "../../components/Toast";
import { ChevronDown } from "lucide-react";

moment.loadPersian({ dialect: "persian-modern" });

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
        setStats(data.stats);
      } else {
        setNotifications([]);
        setStats({ total: 0, high: 0, medium: 0, low: 0 });
      }
    } catch (err) {
      console.error("خطا:", err);
      toast.error("خطا در اتصال به سرور: " + err.message);
      setNotifications([]);
      setStats({ total: 0, high: 0, medium: 0, low: 0 });
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("همه نوتیفیکیشن‌ها خوانده شدند");
      loadNotifications();
    } catch (err) {
      console.error("خطا:", err);
      toast.error("خطا در علامت‌گذاری نوتیفیکیشن‌ها");
    }
  };

  const getIconByCategory = (category) => {
    if (category === "contract")
      return <FileText size={20} className="text-purple-400" />;
    if (category === "todo")
      return <CheckSquare size={20} className="text-blue-400" />;
    if (category === "class")
      return <Calendar size={20} className="text-orange-400" />;
    return <AlertCircle size={20} className="text-yellow-400" />;
  };

  const getBgColor = (type) => {
    if (type === "danger") return "border-red-500/30 bg-red-500/5";
    if (type === "warning") return "border-yellow-500/30 bg-yellow-500/5";
    if (type === "success") return "border-green-500/30 bg-green-500/5";
    return "border-blue-500/30 bg-blue-500/5";
  };

  const getPriorityBadge = (priority) => {
    if (priority === "high")
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">
          اولویت بالا
        </span>
      );
    if (priority === "medium")
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
          اولویت متوسط
        </span>
      );
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-gray-500/20 text-gray-400">
        اولویت کم
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    const m = moment(date);
    return `${m.format("jYYYY/jMM/jDD")} - ${m.format("HH:mm")}`;
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "high") return notif.priority === "high";
    if (filter === "medium") return notif.priority === "medium";
    if (filter === "low") return notif.priority === "low";
    if (filter === "contract") return notif.category === "contract";
    if (filter === "todo") return notif.category === "todo";
    if (filter === "class") return notif.category === "class";
    return true;
  });

  return (
    <div className="notifications-page p-6 min-h-screen" dir="rtl">
      <style>{`
        .notifications-page .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          border-radius: 20px;
        }
        .filter-btn {
          padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 500;
          transition: all 0.2s ease; cursor: pointer;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
        }
        .filter-btn:hover { background: rgba(255,255,255,0.1); }
        .filter-btn.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-color: transparent; }
        .notif-item { transition: all 0.3s ease; }
        .notif-item:hover { transform: translateX(-4px); }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bell className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">نوتیفیکیشن‌ها</h1>
              <p className="text-gray-400 text-sm mt-1">
                مشاهده و مدیریت پیام‌های سیستم
              </p>
            </div>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition text-sm"
            >
              <CheckCircle2 size={16} />
              علامت زدن همه به عنوان خوانده شده
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {stats?.total || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">کل نوتیفیکیشن‌ها</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {stats?.high || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">اولویت بالا</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {stats?.medium || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">اولویت متوسط</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats?.low || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">اولویت کم</div>
        </div>
      </div>

      {/* Filter Notifications */}
<div className="mb-6">
  <style>{`
    .notif-select-wrapper { position: relative; width: 230px; }
    .notif-select-trigger { width: 100%; background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(17,24,39,0.95)); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 14px; padding: 14px 40px; font-size: 0.9rem; text-align: right; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: space-between; backdrop-filter: blur(20px); position: relative; z-index: 10; }
    .notif-select-trigger:hover { border-color: rgba(139,92,246,0.3); }
    .notif-select-trigger.open { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); border-radius: 14px 14px 0 0; }
    .notif-options-container { position: absolute; top: 100%; left: 0; right: 0; background: rgba(17,24,39,0.98); border: 1px solid rgba(139,92,246,0.2); border-top: none; border-radius: 0 0 14px 14px; overflow: hidden; z-index: 20; backdrop-filter: blur(30px); box-shadow: 0 15px 30px rgba(0,0,0,0.4); max-height: 280px; overflow-y: auto; animation: notifDropdown 0.2s; }
    @keyframes notifDropdown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    .notif-option { padding: 12px 16px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.02); color: #cbd5e1; font-size: 0.85rem; }
    .notif-option:hover { background: rgba(139,92,246,0.08); color: #fff; }
    .notif-option.selected { background: rgba(139,92,246,0.12); color: #fff; font-weight: 600; }
    .notif-option-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
    .notif-option-icon.all { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; }
    .notif-option-icon.high { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
    .notif-option-icon.medium { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
    .notif-option-icon.low { background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; }
    .notif-option-icon.contract { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; }
    .notif-option-icon.todo { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .notif-option-icon.class { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
    .notif-option-check { margin-right: auto; color: #a78bfa; font-weight: bold; }
    .notif-options-container::-webkit-scrollbar { width: 3px; }
    .notif-options-container::-webkit-scrollbar-track { background: transparent; }
    .notif-options-container::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 10px; }
    .notif-select-overlay { position: fixed; inset: 0; z-index: 15; }
  `}</style>

  <div className="notif-select-wrapper">
    <div className={`notif-select-trigger ${notifOpen ? "open" : ""}`} onClick={() => setNotifOpen(!notifOpen)}>
      <span>
        {filter === "all" ? "🔔 همه" : 
         filter === "high" ? "🔴 اولویت بالا" : 
         filter === "medium" ? "🟡 اولویت متوسط" : 
         filter === "low" ? "🔵 اولویت کم" : 
         filter === "contract" ? "📄 قراردادها" : 
         filter === "todo" ? "✅ تسک‌ها" : "📅 کلاس‌ها"}
      </span>
      <ChevronDown size={14} className={`transition-transform ${notifOpen ? "rotate-180" : ""} text-purple-400`} />
    </div>
    {notifOpen && (
      <>
        <div className="notif-select-overlay" onClick={() => setNotifOpen(false)} />
        <div className="notif-options-container">
          {[
            { value: "all", label: "همه", icon: "🔔", iconClass: "all" },
            { value: "high", label: "اولویت بالا", icon: "🔴", iconClass: "high" },
            { value: "medium", label: "اولویت متوسط", icon: "🟡", iconClass: "medium" },
            { value: "low", label: "اولویت کم", icon: "🔵", iconClass: "low" },
            { value: "contract", label: "قراردادها", icon: "📄", iconClass: "contract" },
            { value: "todo", label: "تسک‌ها", icon: "✅", iconClass: "todo" },
            { value: "class", label: "کلاس‌ها", icon: "📅", iconClass: "class" },
          ].map((opt) => (
            <div key={opt.value} className={`notif-option ${filter === opt.value ? "selected" : ""}`}
              onClick={() => { setFilter(opt.value); setNotifOpen(false); }}>
              <div className={`notif-option-icon ${opt.iconClass}`}>{opt.icon}</div>
              <span>{opt.label}</span>
              {filter === opt.value && <span className="notif-option-check">✓</span>}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
</div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bell size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">هیچ نوتیفیکیشنی وجود ندارد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.link) navigate(notif.link);
              }}
              className={`notif-item glass-card p-5 cursor-pointer transition-all hover:bg-white/5 ${getBgColor(notif.type)}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    {getIconByCategory(notif.category)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {notif.title}
                      </h3>
                      {getPriorityBadge(notif.priority)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(notif.date)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <div className="text-xs text-gray-500">
                      {notif.category === "contract" && "قرارداد"}
                      {notif.category === "todo" && "تسک"}
                      {notif.category === "class" && "کلاس"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      <span>مشاهده جزئیات</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
