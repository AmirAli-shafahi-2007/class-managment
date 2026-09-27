import React, { useEffect, useState } from "react";
import contractService from "../../services/contractService";
import companyService from "../../services/companyService";
import PersianDatePicker from "../../components/PersianDatePicker";
import moment from "moment-jalaali";
import { toast } from "../../components/Toast";
import {
  ChevronDown,
  Plus,
  FileText,
  Building2,
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

export default function ContractPage() {
  const [contracts, setContracts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const [form, setForm] = useState({
    company: "",
    companyName: "",
    title: "",
    startDate: "",
    endDate: "",
    hourlyRate: "",
    status: "active",
    statusLabel: "فعال",
    notes: "",
    contractFile: null,
  });
  const [displayAmounts, setDisplayAmounts] = useState({ hourlyRate: "" });

  const formatNumberWithCommas = (v) => {
    if (!v && v !== 0) return "";
    return Number(String(v).replace(/[^0-9]/g, "")).toLocaleString("en-US");
  };
  const removeCommas = (v) => (v ? String(v).replace(/,/g, "") : "");
  const handleAmountChange = (f, dv) => {
    const r = removeCommas(dv);
    if (r === "" || /^\d*$/.test(r)) {
      setForm({ ...form, [f]: r });
      setDisplayAmounts({ ...displayAmounts, [f]: formatNumberWithCommas(r) });
    }
  };
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
      company: "",
      companyName: "",
      title: "",
      startDate: "",
      endDate: "",
      hourlyRate: "",
      status: "active",
      statusLabel: "فعال",
      notes: "",
      contractFile: null,
    });
    setDisplayAmounts({ hourlyRate: "" });
    setEditMode(false);
    setFormStep(1);
    setModalOpen(true);
  };
  const openEditModal = (item) => {
    let s = "",
      e = "";
    if (item.startDate) {
      const m = moment(item.startDate);
      if (m.isValid()) s = m.format("jYYYY-jMM-jDD");
    }
    if (item.endDate) {
      const m = moment(item.endDate);
      if (m.isValid()) e = m.format("jYYYY-jMM-jDD");
    }
    const st = item.status || "active";
    setForm({
      company: item.company?._id || "",
      companyName: item.company?.name || "",
      title: item.title || "",
      startDate: s,
      endDate: e,
      hourlyRate: item.hourlyRate || "",
      status: st,
      statusLabel:
        st === "active"
          ? "فعال"
          : st === "finished"
            ? "پایان‌یافته"
            : "لغو شده",
      notes: item.notes || "",
      contractFile: null,
    });
    setDisplayAmounts({ hourlyRate: formatNumberWithCommas(item.hourlyRate) });
    setSelectedContract(item);
    setEditMode(true);
    setFormStep(1);
    setModalOpen(true);
  };
  const openDetailModal = (contract) => {
    setSelectedContract(contract);
    setDetailModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cr, co] = await Promise.all([
        contractService.getAll(),
        companyService.getAll(),
      ]);
      setContracts(cr.data || []);
      setCompanies(co.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.company || !form.hourlyRate) {
      toast.warning("لطفاً فیلدهای ضروری را پر کنید");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        teacher: user._id,
        company: form.company,
        title: form.title,
        hourlyRate: Number(form.hourlyRate),
        status: form.status,
        notes: form.notes || "",
        startDate: form.startDate ? toGregorian(form.startDate) : null,
        endDate: form.endDate ? toGregorian(form.endDate) : null,
      };
      const res = editMode
        ? await contractService.update(selectedContract._id, payload)
        : await contractService.create(payload);
      if (res && res.success !== false) {
        toast.success(
          editMode ? "قرارداد ویرایش شد ✨" : "قرارداد ایجاد شد 🎉",
        );
        setModalOpen(false);
        fetchData();
      } else {
        toast.error(res?.message || "خطا");
      }
    } catch (e) {
      toast.error(e.message || "خطا");
    }
  };

  const handleDelete = async (id) => {
    try {
      await contractService.remove(id);
      setDeleteConfirm(null);
      fetchData();
      toast.success("قرارداد حذف شد");
    } catch (e) {
      console.error(e);
    }
  };

  const filteredContracts = contracts
    .filter((c) => {
      const ms =
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return ms && (statusFilter === "all" || c.status === statusFilter);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount_high":
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case "amount_low":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const statusBadge = (s) =>
    ({
      active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      finished: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
    })[s] || "";
  const statusText = (s) =>
    ({ active: "فعال", finished: "پایان‌یافته", cancelled: "لغو شده" })[s] || s;
  const formatMoney = (n) =>
    n === null || n === undefined || n === ""
      ? "-"
      : Number(n).toLocaleString();

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
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${opt.bg || "bg-gradient-to-br from-purple-500/20 to-pink-500/20"} ${opt.color || "text-purple-400"}`}
                >
                  {opt.avatar || opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm">{opt.label}</span>
                  {opt.sub && (
                    <p className="text-[10px] text-gray-500 truncate">
                      {opt.sub}
                    </p>
                  )}
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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fadeIn 0.2s ease-out; }
        
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 12px 14px; font-size: .85rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 14px 16px; font-size: .9rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08); background: rgba(15,23,42,0.95)!important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.15); font-size: 0.8rem; }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .stat-card { padding: 18px; } }
        .contract-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .contract-card { padding: 18px; } }
        .contract-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .icon-circle { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        @media (min-width: 640px) { .icon-circle { width: 40px; height: 40px; border-radius: 12px; } }
        
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent pt-2 sm:pt-3">
            مدیریت قراردادها
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            مشاهده و مدیریت قراردادهای آموزشی
          </p>
        </div>
        <DisabledButton
          feature="contract"
          onClick={openCreateModal}
          className="create-btn"
        >
          <Plus size={22} />
          <span>ایجاد قرارداد جدید</span>
        </DisabledButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: "کل قراردادها",
            value: contracts.length,
            icon: "📋",
            bg: "bg-blue-500/10",
          },
          {
            label: "فعال",
            value: contracts.filter((c) => c.status === "active").length,
            icon: "✅",
            bg: "bg-emerald-500/10",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="stat-card text-right"
            style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
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

      {/* Search & Filters */}
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
            placeholder="جستجو در قراردادها..."
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
          <div className="flex-1 sm:flex-initial sm:w-[140px] md:w-[170px]">
            <CustomDropdown
              open={statusOpen}
              setOpen={setStatusOpen}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                {
                  value: "all",
                  label: "همه",
                  icon: "📋",
                  avatar: "📋",
                  bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                  color: "text-blue-400",
                },
                {
                  value: "active",
                  label: "فعال",
                  icon: "✅",
                  avatar: "✅",
                  bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                  color: "text-emerald-400",
                },
                {
                  value: "finished",
                  label: "پایان‌یافته",
                  icon: "🏁",
                  avatar: "🏁",
                  bg: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20",
                  color: "text-blue-400",
                },
                {
                  value: "cancelled",
                  label: "لغو شده",
                  icon: "❌",
                  avatar: "❌",
                  bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                  color: "text-red-400",
                },
              ]}
              placeholder="وضعیت"
              icon={null}
            />
          </div>
          <div className="flex-1 sm:flex-initial sm:w-[140px] md:w-[170px]">
            <CustomDropdown
              open={sortOpen}
              setOpen={setSortOpen}
              value={sortBy}
              onChange={setSortBy}
              options={[
                {
                  value: "newest",
                  label: "جدیدترین",
                  icon: "🆕",
                  avatar: "🆕",
                  bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                  color: "text-blue-400",
                },
                {
                  value: "oldest",
                  label: "قدیمی‌ترین",
                  icon: "📅",
                  avatar: "📅",
                  bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                  color: "text-amber-400",
                },
                {
                  value: "amount_high",
                  label: "نرخ: زیاد",
                  icon: "📈",
                  avatar: "📈",
                  bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                  color: "text-emerald-400",
                },
                {
                  value: "amount_low",
                  label: "نرخ: کم",
                  icon: "📉",
                  avatar: "📉",
                  bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                  color: "text-red-400",
                },
              ]}
              placeholder="مرتب‌سازی"
              icon={null}
            />
          </div>
        </div>

        {(searchTerm || statusFilter !== "all" || sortBy !== "newest") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setSortBy("newest");
            }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all"
          >
            <X size={14} />
            <span className="hidden sm:inline">حذف فیلترها</span>
          </button>
        )}
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 sm:p-16 text-center">
          <FileText
            size={36}
            className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-30"
          />
          <p className="text-gray-400 text-sm sm:text-lg">
            {searchTerm ? "قراردادی یافت نشد" : "هنوز قراردادی ثبت نشده!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredContracts.map((c) => (
            <div key={c._id} className="contract-card">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="icon-circle bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm sm:text-base">
                    {c.title?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm sm:text-base truncate">
                      {c.title || "بدون عنوان"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                      {c.company?.name || "-"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border flex-shrink-0 ${statusBadge(c.status)}`}
                >
                  {statusText(c.status)}
                </span>
              </div>
              <div className="mb-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px] sm:text-xs">
                    نرخ هر ساعت
                  </span>
                  <span className="text-emerald-400 font-bold text-sm sm:text-base">
                    {formatMoney(c.hourlyRate)} تومان
                  </span>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-1.5 pt-2.5 sm:pt-3 border-t border-white/5">
                <button
                  onClick={() => openDetailModal(c)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] sm:text-xs flex items-center justify-center gap-1"
                >
                  <Eye size={11} className="sm:w-[13px] sm:h-[13px]" />
                  جزئیات
                </button>
                <button
                  onClick={() => openEditModal(c)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs"
                >
                  <Edit3 size={11} className="sm:w-[13px] sm:h-[13px]" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(c._id)}
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
      {detailModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="glass-card p-5 sm:p-6 rounded-2xl w-full max-w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-y-auto"
            dir="rtl"
            style={{ animation: "modalSlideUp 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold">جزئیات قرارداد</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            <div className="text-center mb-4 sm:mb-5">
              <div className="icon-circle w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 text-xl sm:text-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                {selectedContract.title?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {selectedContract.title || "بدون عنوان"}
              </h3>
              <span
                className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full border mt-2 inline-block ${statusBadge(selectedContract.status)}`}
              >
                {statusText(selectedContract.status)}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                <span className="text-gray-400 text-xs sm:text-sm">شرکت</span>
                <span className="text-white text-xs sm:text-sm">
                  {selectedContract.company?.name || "-"}
                </span>
              </div>
              {selectedContract.startDate && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">شروع</span>
                  <span className="text-white text-xs sm:text-sm">
                    {toPersian(selectedContract.startDate)}
                  </span>
                </div>
              )}
              {selectedContract.endDate && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">
                    پایان
                  </span>
                  <span className="text-white text-xs sm:text-sm">
                    {toPersian(selectedContract.endDate)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                <span className="text-gray-400 text-xs sm:text-sm">نرخ</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {formatMoney(selectedContract.hourlyRate)} تومان
                </span>
              </div>
              {selectedContract.notes && (
                <div className="py-1.5 sm:py-2">
                  <span className="text-gray-400 text-xs sm:text-sm block mb-1">
                    یادداشت
                  </span>
                  <p className="text-white/70 text-xs sm:text-sm bg-white/5 p-2 sm:p-3 rounded-xl">
                    {selectedContract.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(selectedContract);
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
            className="w-full max-w-[95vw] sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
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
                      <FileText
                        size={18}
                        className="sm:w-6 sm:h-6 text-white"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                      {editMode ? "ویرایش قرارداد" : "ایجاد قرارداد جدید"}
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                      {editMode ? "ویرایش" : "ثبت قرارداد آموزشی"}
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
                    {formStep === 1 ? "اطلاعات اصلی" : "جزئیات"}
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 sm:px-8 pt-3 sm:pt-4 space-y-4 sm:space-y-5">
              {(!editMode && formStep === 1) || editMode ? (
                <div className="space-y-4 sm:space-y-5 animate-in">
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      شرکت <span className="text-red-400">*</span>
                    </label>
                    <CustomDropdown
                      open={companyOpen}
                      setOpen={setCompanyOpen}
                      value={form.company}
                      onChange={(val) => {
                        const c = companies.find((co) => co._id === val);
                        setForm({
                          ...form,
                          company: val,
                          companyName: c?.name || "",
                        });
                      }}
                      options={companies.map((c) => ({
                        value: c._id,
                        label: c.name,
                        sub: c.managerName,
                        avatar: c.name?.charAt(0)?.toUpperCase() || "?",
                        bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                        color: "text-emerald-400",
                      }))}
                      placeholder="انتخاب شرکت"
                      icon={
                        <Building2
                          size={14}
                          className="sm:w-4 sm:h-4 text-gray-400"
                        />
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      عنوان قرارداد <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: قرارداد آموزش زبان"
                      className="glass-input"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      نرخ هر ساعت (تومان){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="مثال: 250,000"
                        className="glass-input"
                        value={displayAmounts.hourlyRate}
                        onChange={(e) =>
                          handleAmountChange("hourlyRate", e.target.value)
                        }
                        required
                      />
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm">
                        تومان
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      وضعیت
                    </label>
                    <CustomDropdown
                      open={statusFormOpen}
                      setOpen={setStatusFormOpen}
                      value={form.status}
                      onChange={(val) => {
                        const labels = {
                          active: "فعال",
                          finished: "پایان‌یافته",
                          cancelled: "لغو شده",
                        };
                        setForm({
                          ...form,
                          status: val,
                          statusLabel: labels[val],
                        });
                      }}
                      options={[
                        {
                          value: "active",
                          label: "فعال",
                          avatar: "✅",
                          bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                          color: "text-emerald-400",
                        },
                        {
                          value: "finished",
                          label: "پایان‌یافته",
                          avatar: "🏁",
                          bg: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20",
                          color: "text-blue-400",
                        },
                        {
                          value: "cancelled",
                          label: "لغو شده",
                          avatar: "❌",
                          bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                          color: "text-red-400",
                        },
                      ]}
                      placeholder="انتخاب وضعیت"
                      icon={null}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 animate-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        تاریخ شروع
                      </label>
                      <PersianDatePicker
                        value={form.startDate}
                        onChange={(date) =>
                          setForm({ ...form, startDate: date })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        تاریخ پایان
                      </label>
                      <PersianDatePicker
                        value={form.endDate}
                        onChange={(date) => setForm({ ...form, endDate: date })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      یادداشت
                    </label>
                    <textarea
                      className="glass-input min-h-[80px] sm:min-h-[120px] resize-y"
                      rows={3}
                      placeholder="توضیحات..."
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                    />
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
                      if (!form.title || !form.company || !form.hourlyRate) {
                        toast.warning("فیلدهای ضروری را پر کنید");
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
                    onClick={handleSave}
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
              آیا از حذف این قرارداد اطمینان دارید؟
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-xs sm:text-sm"
              >
                بله
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
