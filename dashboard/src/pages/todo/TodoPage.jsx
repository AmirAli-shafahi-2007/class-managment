import { useEffect, useState } from "react";
import todoService from "../../services/todoService";
import { toast } from "../../components/Toast";
import PersianDatePicker from "../../components/PersianDatePicker";
import moment from "moment-jalaali";
import {
  ChevronDown,
  Plus,
  CheckSquare,
  Eye,
  Edit3,
  Trash2,
  X,
  Save,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import DisabledButton from "../../components/DisabledButton";

moment.loadPersian({ dialect: "persian-modern" });

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [priorityFormOpen, setPriorityFormOpen] = useState(false);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    priorityLabel: "متوسط",
    status: "pending",
    statusLabel: "در انتظار",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const r = await todoService.getAll();
      setTodos(r?.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const toGregorian = (d) => {
    if (!d) return null;
    const m = moment(d, "jYYYY-jMM-jDD");
    return m.isValid() ? m.format("YYYY-MM-DD") : null;
  };
  const toPersian = (d) => {
    if (!d) return "-";
    const m = moment(d);
    return m.isValid() ? m.format("jYYYY-jMM-jDD") : "-";
  };

  const openCreateModal = () => {
    setForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      priorityLabel: "متوسط",
      status: "pending",
      statusLabel: "در انتظار",
    });
    setEditMode(false);
    setFormStep(1);
    setModalOpen(true);
  };
  const openEditModal = (todo) => {
    let dj = "";
    if (todo.dueDate) {
      const m = moment(todo.dueDate);
      if (m.isValid()) dj = m.format("jYYYY-jMM-jDD");
    }
    const p = todo.priority || "medium";
    const s = todo.status || "pending";
    const pl = { high: "بالا", medium: "متوسط", low: "کم" };
    const sl = { pending: "در انتظار", done: "انجام شده" };
    setForm({
      title: todo.title || "",
      description: todo.description || "",
      dueDate: dj,
      priority: p,
      priorityLabel: pl[p] || "متوسط",
      status: s,
      statusLabel: sl[s] || "در انتظار",
    });
    setSelectedTodo(todo);
    setEditMode(true);
    setFormStep(1);
    setModalOpen(true);
  };
  const openDetailModal = (todo) => {
    setSelectedTodo(todo);
    setDetailModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warning("عنوان تسک الزامی است");
      return;
    }
    try {
      const payload = {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate ? toGregorian(form.dueDate) : null,
        priority: form.priority,
        status: form.status,
      };
      if (editMode) {
        await todoService.update(selectedTodo._id, payload);
        toast.success("تسک ویرایش شد ✨");
      } else {
        await todoService.create(payload);
        toast.success("تسک ایجاد شد 🎉");
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      toast.error("خطا در ذخیره تسک");
    }
  }

  async function handleDelete(id) {
    try {
      await todoService.remove(id);
      setDeleteConfirm(null);
      loadData();
      toast.success("تسک حذف شد");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleToggle(todo) {
    try {
      const ns = todo.status === "done" ? "pending" : "done";
      setTodos((p) =>
        p.map((t) => (t._id === todo._id ? { ...t, status: ns } : t)),
      );
      await todoService.update(todo._id, { status: ns });
    } catch (e) {
      loadData();
    }
  }

  const isOverdue = (t) => {
    if (!t.dueDate || t.status === "done") return false;
    return new Date(t.dueDate) < new Date();
  };
  const getDaysRemaining = (t) => {
    if (!t.dueDate || t.status === "done") return null;
    return Math.ceil(
      (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
  };

  const priorityConfig = {
    high: {
      label: "بالا",
      color: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    medium: {
      label: "متوسط",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    low: {
      label: "کم",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
  };

  const filteredTodos = todos
    .filter((t) => {
      const ms =
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return (
        ms &&
        (statusFilter === "all" || t.status === statusFilter) &&
        (priorityFilter === "all" || t.priority === priorityFilter)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const o = { high: 3, medium: 2, low: 1 };
          return (o[b.priority] || 0) - (o[a.priority] || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const totalTodos = todos.length,
    doneTodos = todos.filter((t) => t.status === "done").length,
    pendingTodos = todos.filter((t) => t.status === "pending").length,
    overdueTodos = todos.filter((t) => isOverdue(t)).length,
    completionRate =
      totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0;

  const CustomDropdown = ({
    open,
    setOpen,
    value,
    onChange,
    options,
    placeholder,
    icon,
  }) => (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className={`dds-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        style={{ padding: "11px 14px", fontSize: "0.85rem" }}
      >
        <span className="flex items-center gap-2">
          {icon}
          <span
            className={`truncate ${value && options.find((o) => o.value === value) ? "text-white" : "text-gray-500"}`}
          >
            {options.find((o) => o.value === value)
              ? options.find((o) => o.value === value).label
              : placeholder}
          </span>
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""} text-purple-400 flex-shrink-0`}
        />
      </div>
      {open && (
        <>
          <div className="dds-overlay" onClick={() => setOpen(false)} />
          <div className="dds-options">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`dds-option ${value === opt.value ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt.value, opt.label);
                  setOpen(false);
                }}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${opt.bg || "bg-gradient-to-br from-purple-500/20"} ${opt.color || "text-purple-400"}`}
                >
                  {opt.avatar || opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm">{opt.label}</span>
                </div>
                {value === opt.value && (
                  <span
                    style={{
                      color: "#a78bfa",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen" dir="rtl">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 100% { box-shadow: 0 0 0 20px rgba(139,92,246,0); } }
        
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 12px 14px; font-size: .85rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 14px 16px; font-size: .9rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08); background: rgba(15,23,42,0.95)!important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.15); font-size: 0.8rem; }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 12px; transition: all .3s; }
        @media (min-width: 640px) { .stat-card { border-radius: 18px; padding: 18px; } }
        .todo-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .todo-card { border-radius: 18px; padding: 18px; } }
        .todo-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .todo-card.done { opacity: 0.45; }
        .todo-card.overdue { border-color: rgba(239,68,68,0.2); }
        .icon-circle { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        @media (min-width: 640px) { .icon-circle { width: 40px; height: 40px; border-radius: 12px; } }
        
        .custom-checkbox { width: 22px; height: 22px; border-radius: 7px; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .3s; flex-shrink: 0; }
        @media (min-width: 640px) { .custom-checkbox { width: 24px; height: 24px; border-radius: 8px; } }
        .custom-checkbox:hover { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.1); }
        .custom-checkbox.checked { background: linear-gradient(135deg, #8b5cf6, #6366f1); border-color: transparent; }
        
        .dds-trigger { background: rgba(17,24,39,0.9); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; text-align: right; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .dds-trigger:hover { border-color: rgba(139,92,246,0.3); }
        .dds-trigger.open { border-color: rgba(139,92,246,0.5); border-radius: 12px 12px 0 0; }
        .dds-options { position: absolute; top: 100%; left: 0; right: 0; background: rgba(17,24,39,0.98); border: 1px solid rgba(139,92,246,0.2); border-top: none; border-radius: 0 0 12px 12px; z-index: 20; max-height: 200px; overflow-y: auto; animation: ddsSlide 0.15s; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        @keyframes ddsSlide { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .dds-option { padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.02); color: #cbd5e1; font-size: 0.8rem; }
        @media (min-width: 640px) { .dds-option { padding: 12px 16px; font-size: 0.85rem; } }
        .dds-option:hover { background: rgba(139,92,246,0.08); color: #fff; }
        .dds-option.selected { background: rgba(139,92,246,0.12); color: #fff; font-weight: 600; }
        .dds-overlay { position: fixed; inset: 0; z-index: 15; }

        .create-btn { position: relative; background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899); background-size: 200% 200%; animation: gradient-shift 4s ease infinite; padding: 12px 22px; border-radius: 14px; color: white; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 30px rgba(139,92,246,0.3); overflow: hidden; display: flex; align-items: center; gap: 8px; }
        @media (min-width: 640px) { .create-btn { padding: 14px 28px; border-radius: 16px; font-size: 0.95rem; gap: 10px; } }
        .create-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(139,92,246,0.45); }
        .create-btn .pulse-dot { position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; border-radius: 50%; background: #fbbf24; animation: pulse-ring 2s infinite; }
        @media (min-width: 640px) { .create-btn .pulse-dot { width: 12px; height: 12px; } }
        .progress-bar { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); overflow: hidden; }
        @media (min-width: 640px) { .progress-bar { height: 10px; border-radius: 5px; } }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 1.5s; background: linear-gradient(90deg, #8b5cf6, #6366f1, #8b5cf6); background-size: 200% 100%; animation: shimmer 3s infinite; }
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        
        .step-dot { width: 30px; height: 30px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; transition: all 0.3s; background: rgba(255,255,255,0.04); color: #64748b; border: 1.5px solid rgba(255,255,255,0.06); flex-shrink: 0; }
        @media (min-width: 640px) { .step-dot { width: 36px; height: 36px; border-radius: 12px; font-size: 0.8rem; } }
        .step-dot.active { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-color: transparent; box-shadow: 0 4px 15px rgba(139,92,246,0.3); }
        .step-dot.done { background: rgba(16,185,129,0.15); color: #10b981; border-color: rgba(16,185,129,0.3); }
        .step-line { flex: 1; height: 1.5px; background: rgba(255,255,255,0.06); }
        .step-line.done { background: rgba(16,185,129,0.3); }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            مدیریت تسک‌ها
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            پیگیری و مدیریت وظایف روزانه
          </p>
        </div>
        <DisabledButton
          feature="toDo"
          onClick={openCreateModal}
          className="create-btn"
        >
          <Plus size={22} />
          <span>ایجاد تسک جدید</span>
        </DisabledButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "کل", value: totalTodos, icon: "📋", bg: "bg-blue-500/10" },
          {
            label: "در انتظار",
            value: pendingTodos,
            icon: "⏳",
            bg: "bg-amber-500/10",
          },
          {
            label: "انجام شده",
            value: doneTodos,
            icon: "✅",
            bg: "bg-emerald-500/10",
          },
          {
            label: "عقب افتاده",
            value: overdueTodos,
            icon: "⚠️",
            bg: "bg-red-500/10",
          },
          {
            label: "نرخ تکمیل",
            value: `${completionRate}%`,
            icon: "📊",
            bg: "bg-purple-500/10",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="stat-card text-right"
            style={{ animation: `slideUp 0.4s ease-out ${i * 0.06}s both` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg sm:text-2xl font-extrabold text-white">
                  {s.value}
                </div>
                <div className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                  {s.label}
                </div>
              </div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${s.bg} flex items-center justify-center`}
              >
                <span className="text-base sm:text-xl">{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm text-gray-400">پیشرفت کلی</span>
          <span className="text-xs sm:text-sm font-bold text-purple-400">
            {completionRate}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="جستجو در تسک‌ها..."
            className="glass-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial sm:w-[120px] md:w-[140px]">
            <CustomDropdown
              open={statusOpen}
              setOpen={setStatusOpen}
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              options={[
                {
                  value: "all",
                  label: "همه",
                  avatar: "📋",
                  bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                  color: "text-blue-400",
                },
                {
                  value: "pending",
                  label: "در انتظار",
                  avatar: "⏳",
                  bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                  color: "text-amber-400",
                },
                {
                  value: "done",
                  label: "انجام شده",
                  avatar: "✅",
                  bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                  color: "text-emerald-400",
                },
              ]}
              placeholder="وضعیت"
              icon="📋"
            />
          </div>
          <div className="flex-1 sm:flex-initial sm:w-[110px] md:w-[130px]">
            <CustomDropdown
              open={priorityOpen}
              setOpen={setPriorityOpen}
              value={priorityFilter}
              onChange={(v) => setPriorityFilter(v)}
              options={[
                {
                  value: "all",
                  label: "همه",
                  avatar: "🎯",
                  bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
                  color: "text-purple-400",
                },
                {
                  value: "high",
                  label: "بالا",
                  avatar: "🔴",
                  bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                  color: "text-red-400",
                },
                {
                  value: "medium",
                  label: "متوسط",
                  avatar: "🟡",
                  bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                  color: "text-amber-400",
                },
                {
                  value: "low",
                  label: "کم",
                  avatar: "🔵",
                  bg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
                  color: "text-blue-400",
                },
              ]}
              placeholder="اولویت"
              icon="🎯"
            />
          </div>
          <div className="flex-1 sm:flex-initial sm:w-[130px] md:w-[150px]">
            <CustomDropdown
              open={sortOpen}
              setOpen={setSortOpen}
              value={sortBy}
              onChange={(v) => setSortBy(v)}
              options={[
                {
                  value: "newest",
                  label: "جدیدترین",
                  avatar: "🆕",
                  bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                  color: "text-blue-400",
                },
                {
                  value: "oldest",
                  label: "قدیمی‌ترین",
                  avatar: "📅",
                  bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                  color: "text-amber-400",
                },
                {
                  value: "dueDate",
                  label: "موعد",
                  avatar: "📆",
                  bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                  color: "text-emerald-400",
                },
                {
                  value: "priority",
                  label: "اولویت",
                  avatar: "⭐",
                  bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
                  color: "text-purple-400",
                },
              ]}
              placeholder="مرتب‌سازی"
              icon="↕️"
            />
          </div>
        </div>

        {(searchTerm ||
          statusFilter !== "all" ||
          priorityFilter !== "all" ||
          sortBy !== "newest") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
              setSortBy("newest");
            }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all"
          >
            <X size={14} />
            <span className="hidden sm:inline">حذف فیلترها</span>
          </button>
        )}
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 sm:p-16 text-center">
          <CheckSquare
            size={36}
            className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-30"
          />
          <p className="text-gray-400 text-sm sm:text-lg">
            {searchTerm ? "تسکی یافت نشد" : "هنوز تسکی ثبت نشده!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              className={`todo-card ${todo.status === "done" ? "done" : ""} ${isOverdue(todo) ? "overdue" : ""}`}
            >
              <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                <div
                  className={`custom-checkbox ${todo.status === "done" ? "checked" : ""}`}
                  onClick={() => handleToggle(todo)}
                >
                  {todo.status === "done" && (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <h3
                    className={`font-semibold text-sm sm:text-base ${todo.status === "done" ? "line-through text-gray-500" : "text-white"}`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-1 line-clamp-2">
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3 justify-end">
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${priorityConfig[todo.priority]?.color}`}
                >
                  {priorityConfig[todo.priority]?.label}
                </span>
                {todo.dueDate && (
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${isOverdue(todo) ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
                  >
                    {isOverdue(todo)
                      ? "عقب افتاده"
                      : `${getDaysRemaining(todo)} روز`}
                  </span>
                )}
              </div>
              <div className="flex gap-1 sm:gap-1.5 pt-2.5 sm:pt-3 border-t border-white/5">
                <button
                  onClick={() => openDetailModal(todo)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] sm:text-xs flex items-center justify-center gap-1"
                >
                  <Eye size={11} className="sm:w-[13px] sm:h-[13px]" />
                  جزئیات
                </button>
                <button
                  onClick={() => openEditModal(todo)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs"
                >
                  <Edit3 size={11} className="sm:w-[13px] sm:h-[13px]" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(todo._id)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] sm:text-xs"
                >
                  <Trash2 size={11} className="sm:w-[13px] sm:h-[13px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedTodo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="glass-card p-5 sm:p-6 rounded-2xl w-full max-w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-y-auto"
            dir="rtl"
            style={{ animation: "modalSlideUp 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold">جزئیات تسک</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            <div className="text-center mb-4 sm:mb-5">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-2xl flex items-center justify-center text-xl sm:text-2xl ${selectedTodo.status === "done" ? "bg-emerald-500/20" : isOverdue(selectedTodo) ? "bg-red-500/20" : "bg-blue-500/20"}`}
              >
                {selectedTodo.status === "done"
                  ? "✅"
                  : isOverdue(selectedTodo)
                    ? "⚠️"
                    : "📋"}
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {selectedTodo.title}
              </h3>
              <span
                className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full border mt-2 inline-block ${selectedTodo.status === "done" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
              >
                {selectedTodo.status === "done" ? "انجام شده" : "در انتظار"}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {selectedTodo.description && (
                <div className="py-1.5 sm:py-2">
                  <span className="text-gray-400 text-xs sm:text-sm block mb-1">
                    توضیحات
                  </span>
                  <p className="text-white/70 text-xs sm:text-sm bg-white/5 p-2 sm:p-3 rounded-xl">
                    {selectedTodo.description}
                  </p>
                </div>
              )}
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                <span className="text-gray-400 text-xs sm:text-sm">اولویت</span>
                <span
                  className={`text-xs sm:text-sm font-bold ${selectedTodo.priority === "high" ? "text-red-400" : selectedTodo.priority === "medium" ? "text-amber-400" : "text-blue-400"}`}
                >
                  {priorityConfig[selectedTodo.priority]?.label}
                </span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                <span className="text-gray-400 text-xs sm:text-sm">موعد</span>
                <span className="text-white text-xs sm:text-sm">
                  {toPersian(selectedTodo.dueDate)}
                  {selectedTodo.dueDate && selectedTodo.status !== "done" && (
                    <span className="text-[10px] sm:text-xs mr-2 text-gray-500">
                      (
                      {isOverdue(selectedTodo)
                        ? "عقب افتاده"
                        : `${getDaysRemaining(selectedTodo)} روز`}
                      )
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(selectedTodo);
                }}
                className="flex-1 py-2 sm:py-2.5 bg-blue-600/70 hover:bg-blue-600 rounded-xl text-xs sm:text-sm transition"
              >
                ویرایش
              </button>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="flex-1 py-2 sm:py-2.5 bg-gray-700/50 rounded-xl text-xs sm:text-sm transition"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div
            className="w-full max-w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0f172a 0%, #0a0f1a 100%)",
              animation: "modalSlideUp 0.35s",
            }}
            dir="rtl"
          >
            <div
              className="p-5 sm:p-8 pb-3 sm:pb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.04) 50%, transparent 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                    {editMode ? (
                      <Edit3 size={18} className="sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <CheckSquare
                        size={18}
                        className="sm:w-6 sm:h-6 text-white"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                      {editMode ? "ویرایش تسک" : "ایجاد تسک جدید"}
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                      {editMode ? "ویرایش" : "ثبت وظیفه جدید"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center"
                >
                  <X size={16} className="sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>
              {!editMode && (
                <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <div
                    className={`step-dot ${formStep >= 1 ? "active" : ""} ${formStep > 1 ? "done" : ""}`}
                  >
                    1
                  </div>
                  <div className={`step-line ${formStep > 1 ? "done" : ""}`} />
                  <div className={`step-dot ${formStep >= 2 ? "active" : ""}`}>
                    2
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500 mr-2 sm:mr-3">
                    {formStep === 1 ? "اطلاعات اصلی" : "تنظیمات"}
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 sm:px-8 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
              {(!editMode && formStep === 1) || editMode ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      عنوان تسک <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="عنوان تسک"
                      className="glass-input"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      توضیحات
                    </label>
                    <textarea
                      className="glass-input min-h-[80px] sm:min-h-[100px] resize-y"
                      rows={3}
                      placeholder="توضیحات..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      موعد مقرر (شمسی)
                    </label>
                    <PersianDatePicker
                      value={form.dueDate}
                      onChange={(date) => setForm({ ...form, dueDate: date })}
                      placeholder="انتخاب تاریخ"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        اولویت
                      </label>
                      <CustomDropdown
                        open={priorityFormOpen}
                        setOpen={setPriorityFormOpen}
                        value={form.priority}
                        onChange={(v, l) =>
                          setForm({ ...form, priority: v, priorityLabel: l })
                        }
                        options={[
                          {
                            value: "high",
                            label: "بالا",
                            avatar: "🔴",
                            bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                            color: "text-red-400",
                          },
                          {
                            value: "medium",
                            label: "متوسط",
                            avatar: "🟡",
                            bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                            color: "text-amber-400",
                          },
                          {
                            value: "low",
                            label: "کم",
                            avatar: "🔵",
                            bg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
                            color: "text-blue-400",
                          },
                        ]}
                        placeholder="اولویت"
                        icon="🎯"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        وضعیت
                      </label>
                      <CustomDropdown
                        open={statusFormOpen}
                        setOpen={setStatusFormOpen}
                        value={form.status}
                        onChange={(v, l) =>
                          setForm({ ...form, status: v, statusLabel: l })
                        }
                        options={[
                          {
                            value: "pending",
                            label: "در انتظار",
                            avatar: "⏳",
                            bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                            color: "text-amber-400",
                          },
                          {
                            value: "done",
                            label: "انجام شده",
                            avatar: "✅",
                            bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                            color: "text-emerald-400",
                          },
                        ]}
                        placeholder="وضعیت"
                        icon="📋"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-1 sm:pt-2">
              {!editMode && formStep === 2 && (
                <button
                  onClick={() => setFormStep(1)}
                  className="w-full mb-3 sm:mb-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-400 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />{" "}
                  بازگشت
                </button>
              )}
              <div className="flex gap-2 sm:gap-3">
                {!editMode && formStep === 1 ? (
                  <button
                    onClick={() => {
                      if (!form.title.trim()) {
                        toast.warning("عنوان تسک را وارد کنید");
                        return;
                      }
                      setFormStep(2);
                    }}
                    className="flex-1 py-2.5 sm:py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)",
                      backgroundSize: "200% 200%",
                      animation: "gradient-shift 3s ease infinite",
                    }}
                  >
                    ادامه <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-2.5 sm:py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)",
                      backgroundSize: "200% 200%",
                      animation: "gradient-shift 3s ease infinite",
                    }}
                  >
                    <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                    {editMode ? "ذخیره" : "ایجاد"}
                  </button>
                )}
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 sm:py-3.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium text-xs sm:text-sm transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="glass-card p-5 sm:p-6 rounded-2xl w-full max-w-[90vw] sm:max-w-[380px] text-center"
            dir="rtl"
            style={{ animation: "modalSlideUp 0.3s ease-out" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle size={24} className="sm:w-7 sm:h-7 text-red-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">
              تأیید حذف
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6">
              آیا از حذف این تسک اطمینان دارید؟
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-xs sm:text-sm"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 sm:py-2.5 bg-gray-700/50 rounded-xl text-xs sm:text-sm"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
