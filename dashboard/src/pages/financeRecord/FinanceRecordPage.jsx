import { useEffect, useState } from "react";
import financeService from "../../services/financeService";
import companyService from "../../services/companyService";
import contractService from "../../services/contractService";
import PersianDatePicker from "../../components/PersianDatePicker";
import moment from "moment-jalaali";
import { toast } from "../../components/Toast";
import {
  ChevronDown,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  AlertCircle,
  Calendar,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Save,
  Sparkles,
} from "lucide-react";
import DisabledButton from "../../components/DisabledButton";

moment.loadPersian({ dialect: "persian-modern" });

const paymentMethodLabels = {
  cash: "نقد",
  card: "کارت",
  transfer: "انتقال",
  other: "سایر",
};

export default function FinanceRecordPage() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [companyFormOpen, setCompanyFormOpen] = useState(false);
  const [contractFormOpen, setContractFormOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const [form, setForm] = useState({
    company: "",
    companyName: "",
    contract: "",
    contractTitle: "",
    date: moment().format("jYYYY-jMM-jDD"),
    amount: "",
    type: "income",
    category: "",
    paymentMethod: "cash",
    paymentLabel: "نقد",
    description: "",
  });
  const [displayAmount, setDisplayAmount] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [rr, cr, cor] = await Promise.all([
        financeService.getAll(),
        companyService.getAll(),
        contractService.getAll(),
      ]);
      setRecords(rr?.data || []);
      setCompanies(cr?.data || []);
      setContracts(cor?.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const handleCompanyChange = async (companyId, companyName) => {
    setForm({
      ...form,
      company: companyId,
      companyName,
      contract: "",
      contractTitle: "",
    });
    if (companyId) {
      try {
        const all = await contractService.getAll();
        setContracts(
          all.data.filter(
            (c) =>
              (c.company?._id === companyId || c.company === companyId) &&
              c.status === "active",
          ),
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      setContracts([]);
    }
  };

  const formatNum = (v) => {
    if (!v && v !== 0) return "";
    return Number(String(v).replace(/[^0-9]/g, "")).toLocaleString("en-US");
  };
  const removeCommas = (v) => (v ? String(v).replace(/,/g, "") : "");
  const handleAmountChange = (dv) => {
    const r = removeCommas(dv);
    if (r === "" || /^\d*$/.test(r)) {
      setForm({ ...form, amount: r });
      setDisplayAmount(formatNum(r));
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
      contract: "",
      contractTitle: "",
      date: moment().format("jYYYY-jMM-jDD"),
      amount: "",
      type: "income",
      category: "",
      paymentMethod: "cash",
      paymentLabel: "نقد",
      description: "",
    });
    setDisplayAmount("");
    setEditMode(false);
    setFormStep(1);
    setModalOpen(true);
  };
  const openEditModal = (r) => {
    let jd = moment().format("jYYYY-jMM-jDD");
    if (r.date) {
      const m = moment(r.date);
      if (m.isValid()) jd = m.format("jYYYY-jMM-jDD");
    }
    const pm = r.paymentMethod || "cash";
    setForm({
      company: r.company?._id || "",
      companyName: r.company?.name || "",
      contract: r.contract?._id || "",
      contractTitle: r.contract?.title || "",
      date: jd,
      amount: r.amount || "",
      type: r.type || "income",
      category: r.category || "",
      paymentMethod: pm,
      paymentLabel: paymentMethodLabels[pm] || "نقد",
      description: r.description || "",
    });
    setDisplayAmount(formatNum(r.amount));
    setSelectedRecord(r);
    setEditMode(true);
    setFormStep(1);
    setModalOpen(true);
  };
  const openDetailModal = (r) => {
    setSelectedRecord(r);
    setDetailModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      toast.warning("لطفاً مبلغ را وارد کنید");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        teacher: user._id,
        amount: Number(form.amount),
        type: form.type,
        date: toGregorian(form.date),
        paymentMethod: form.paymentMethod,
        company: form.company || undefined,
        contract: form.contract || undefined,
        category: form.category || undefined,
        description: form.description || undefined,
      };
      const res = editMode
        ? await financeService.update(selectedRecord._id, payload)
        : await financeService.create(payload);
      if (res && res.success !== false) {
        toast.success(editMode ? "تراکنش ویرایش شد ✨" : "تراکنش ثبت شد 🎉");
        setModalOpen(false);
        loadData();
      } else {
        toast.error(res?.message || "خطا");
      }
    } catch (e) {
      toast.error(e.message || "خطا");
    }
  }

  async function handleDelete(id) {
    try {
      await financeService.remove(id);
      setDeleteConfirm(null);
      loadData();
      toast.success("تراکنش حذف شد");
    } catch (e) {
      console.error(e);
    }
  }

  const formatMoney = (n) => (!n && n !== 0 ? "-" : Number(n).toLocaleString());

  const filteredRecords = records
    .filter((r) => {
      const ms =
        r.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.contract?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return ms && (typeFilter === "all" || r.type === typeFilter);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "amount_high":
          return (b.amount || 0) - (a.amount || 0);
        case "amount_low":
          return (a.amount || 0) - (b.amount || 0);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + (r.amount || 0), 0);
  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + (r.amount || 0), 0);
  const balance = totalIncome - totalExpense;

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
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${opt.bg || "bg-purple-500/20"} ${opt.color || "text-purple-400"}`}
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
        
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 12px 14px; font-size: .85rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 14px 16px; font-size: .9rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08); background: rgba(15,23,42,0.95)!important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.15); font-size: 0.8rem; }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .stat-card { border-radius: 18px; padding: 18px; } }
        .finance-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 14px; transition: all .3s; border-right: 3px solid transparent; }
        @media (min-width: 640px) { .finance-card { border-radius: 18px; padding: 18px; } }
        .finance-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .finance-card.income { border-right-color: rgba(16,185,129,0.4); }
        .finance-card.expense { border-right-color: rgba(239,68,68,0.4); }
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            مدیریت مالی
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            ثبت و پیگیری درآمدها و هزینه‌ها
          </p>
        </div>
        <DisabledButton
          feature="finance"
          onClick={openCreateModal}
          className="create-btn"
        >
          <Plus size={22} />
          <span>ثبت تراکنش جدید</span>
        </DisabledButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: "کل درآمد",
            value: formatMoney(totalIncome),
            icon: <TrendingUp size={18} className="sm:w-5 sm:h-5" />,
            bg: "bg-emerald-500/10",
            color: "text-emerald-400",
          },
          {
            label: "کل هزینه",
            value: formatMoney(totalExpense),
            icon: <TrendingDown size={18} className="sm:w-5 sm:h-5" />,
            bg: "bg-red-500/10",
            color: "text-red-400",
          },
          {
            label: "موجودی",
            value: formatMoney(balance),
            icon: <DollarSign size={18} className="sm:w-5 sm:h-5" />,
            bg: balance >= 0 ? "bg-blue-500/10" : "bg-red-500/10",
            color: balance >= 0 ? "text-blue-400" : "text-red-400",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="stat-card text-right"
            style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-lg sm:text-2xl font-extrabold ${s.color}`}
                >
                  {s.value}{" "}
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    تومان
                  </span>
                </div>
                <div className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                  {s.label}
                </div>
              </div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}
              >
                {s.icon}
              </div>
            </div>
          </div>
        ))}
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
            placeholder="جستجو در تراکنش‌ها..."
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
              open={typeOpen}
              setOpen={setTypeOpen}
              value={typeFilter}
              onChange={(v) => setTypeFilter(v)}
              options={[
                {
                  value: "all",
                  label: "همه",
                  avatar: "💰",
                  bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                  color: "text-blue-400",
                },
                {
                  value: "income",
                  label: "درآمد",
                  avatar: "📈",
                  bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                  color: "text-emerald-400",
                },
                {
                  value: "expense",
                  label: "هزینه",
                  avatar: "📉",
                  bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                  color: "text-red-400",
                },
              ]}
              placeholder="نوع"
              icon="💰"
            />
          </div>
          <div className="flex-1 sm:flex-initial sm:w-[140px] md:w-[160px]">
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
                  value: "amount_high",
                  label: "بیشترین مبلغ",
                  avatar: "📈",
                  bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                  color: "text-emerald-400",
                },
                {
                  value: "amount_low",
                  label: "کمترین مبلغ",
                  avatar: "📉",
                  bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
                  color: "text-red-400",
                },
              ]}
              placeholder="مرتب‌سازی"
              icon="↕️"
            />
          </div>
        </div>

        {(searchTerm || typeFilter !== "all" || sortBy !== "newest") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
              setSortBy("newest");
            }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all"
          >
            <X size={14} />
            <span className="hidden sm:inline">حذف فیلترها</span>
          </button>
        )}
      </div>

      {/* Records List */}
      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 sm:p-16 text-center">
          <DollarSign
            size={36}
            className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-30"
          />
          <p className="text-gray-400 text-sm sm:text-lg">
            {searchTerm ? "تراکنشی یافت نشد" : "هنوز تراکنشی ثبت نشده!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredRecords.map((r) => (
            <div key={r._id} className={`finance-card ${r.type}`}>
              <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className={`icon-circle ${r.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10"}`}
                  >
                    {r.type === "income" ? (
                      <ArrowUpRight
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-emerald-400"
                      />
                    ) : (
                      <ArrowDownLeft
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-red-400"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">
                      {formatMoney(r.amount)}{" "}
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        تومان
                      </span>
                    </h3>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${r.type === "income" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                    >
                      {r.type === "income" ? "درآمد" : "هزینه"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-1.5 mb-2.5 sm:mb-3 text-[10px] sm:text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={10} className="sm:w-[11px] sm:h-[11px]" />
                  {toPersian(r.date)}
                </div>
                {r.company && (
                  <div className="flex items-center gap-1">
                    <Building2 size={10} className="sm:w-[11px] sm:h-[11px]" />
                    {r.company.name}
                  </div>
                )}
                {r.contract && (
                  <div className="flex items-center gap-1">
                    <FileText size={10} className="sm:w-[11px] sm:h-[11px]" />
                    {r.contract.title}
                  </div>
                )}
              </div>
              <div className="flex gap-1 sm:gap-1.5 pt-2.5 sm:pt-3 border-t border-white/5">
                <button
                  onClick={() => openDetailModal(r)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] sm:text-xs flex items-center justify-center gap-1"
                >
                  <Eye size={11} className="sm:w-[13px] sm:h-[13px]" />
                  جزئیات
                </button>
                <button
                  onClick={() => openEditModal(r)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs"
                >
                  <Edit3 size={11} className="sm:w-[13px] sm:h-[13px]" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(r._id)}
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
      {detailModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="glass-card p-5 sm:p-6 rounded-2xl w-full max-w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-y-auto"
            dir="rtl"
            style={{ animation: "modalSlideUp 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold">جزئیات تراکنش</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            <div className="text-center mb-4 sm:mb-5">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-2xl flex items-center justify-center text-white ${selectedRecord.type === "income" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}
              >
                {selectedRecord.type === "income" ? (
                  <TrendingUp size={24} className="sm:w-7 sm:h-7" />
                ) : (
                  <TrendingDown size={24} className="sm:w-7 sm:h-7" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {formatMoney(selectedRecord.amount)}{" "}
                <span className="text-sm sm:text-base text-gray-400">
                  تومان
                </span>
              </h3>
              <span
                className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full border mt-2 inline-block ${selectedRecord.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
              >
                {selectedRecord.type === "income" ? "درآمد" : "هزینه"}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                <span className="text-gray-400 text-xs sm:text-sm">تاریخ</span>
                <span className="text-white text-xs sm:text-sm">
                  {toPersian(selectedRecord.date)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                <span className="text-gray-400 text-xs sm:text-sm">
                  روش پرداخت
                </span>
                <span className="text-white text-xs sm:text-sm">
                  {paymentMethodLabels[selectedRecord.paymentMethod] || "-"}
                </span>
              </div>
              {selectedRecord.company && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">شرکت</span>
                  <span className="text-white text-xs sm:text-sm">
                    {selectedRecord.company.name}
                  </span>
                </div>
              )}
              {selectedRecord.contract && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">
                    قرارداد
                  </span>
                  <span className="text-white text-xs sm:text-sm">
                    {selectedRecord.contract.title}
                  </span>
                </div>
              )}
              {selectedRecord.category && (
                <div className="flex justify-between py-1.5 sm:py-2">
                  <span className="text-gray-400 text-xs sm:text-sm">
                    دسته‌بندی
                  </span>
                  <span className="text-white text-xs sm:text-sm">
                    {selectedRecord.category}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(selectedRecord);
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
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
                    {editMode ? (
                      <Edit3 size={18} className="sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <DollarSign
                        size={18}
                        className="sm:w-6 sm:h-6 text-white"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                      {editMode ? "ویرایش تراکنش" : "ثبت تراکنش جدید"}
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                      ثبت درآمد یا هزینه
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
                    {formStep === 1 ? "مبلغ و نوع" : "جزئیات"}
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 sm:px-8 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
              {(!editMode && formStep === 1) || editMode ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "income" })}
                      className={`flex-1 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm border transition ${form.type === "income" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-gray-400"}`}
                    >
                      📈 درآمد
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "expense" })}
                      className={`flex-1 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm border transition ${form.type === "expense" ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-white/5 border-white/10 text-gray-400"}`}
                    >
                      📉 هزینه
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      مبلغ (تومان) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="مثال: 500,000"
                        className="glass-input"
                        value={displayAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        required
                      />
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm">
                        تومان
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      تاریخ (شمسی) *
                    </label>
                    <PersianDatePicker
                      value={form.date}
                      onChange={(date) => setForm({ ...form, date })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        روش پرداخت
                      </label>
                      <CustomDropdown
                        open={paymentOpen}
                        setOpen={setPaymentOpen}
                        value={form.paymentMethod}
                        onChange={(v, l) =>
                          setForm({
                            ...form,
                            paymentMethod: v,
                            paymentLabel: l,
                          })
                        }
                        options={[
                          {
                            value: "cash",
                            label: "نقد",
                            avatar: "💵",
                            bg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
                            color: "text-emerald-400",
                          },
                          {
                            value: "card",
                            label: "کارت",
                            avatar: "💳",
                            bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                            color: "text-blue-400",
                          },
                          {
                            value: "transfer",
                            label: "انتقال",
                            avatar: "🏦",
                            bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
                            color: "text-purple-400",
                          },
                          {
                            value: "other",
                            label: "سایر",
                            avatar: "📋",
                            bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
                            color: "text-amber-400",
                          },
                        ]}
                        placeholder="روش پرداخت"
                        icon="💳"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        شرکت
                      </label>
                      <CustomDropdown
                        open={companyFormOpen}
                        setOpen={setCompanyFormOpen}
                        value={form.company}
                        onChange={(v, l) => handleCompanyChange(v, l)}
                        options={companies.map((c) => ({
                          value: c._id,
                          label: c.name,
                          sub: c.managerName,
                          avatar: c.name?.charAt(0)?.toUpperCase() || "🏢",
                          bg: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                          color: "text-blue-400",
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
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      قرارداد
                    </label>
                    <CustomDropdown
                      open={contractFormOpen}
                      setOpen={setContractFormOpen}
                      value={form.contract}
                      onChange={(v, l) =>
                        setForm({ ...form, contract: v, contractTitle: l })
                      }
                      options={contracts.map((c) => ({
                        value: c._id,
                        label: c.title,
                        sub: c.hourlyRate
                          ? `${c.hourlyRate.toLocaleString()} تومان/ساعت`
                          : "",
                        avatar: "📄",
                        bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
                        color: "text-purple-400",
                      }))}
                      placeholder="بدون قرارداد"
                      icon={
                        <FileText
                          size={14}
                          className="sm:w-4 sm:h-4 text-gray-400"
                        />
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      دسته‌بندی
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: حقوق، شهریه"
                      className="glass-input"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                      توضیحات
                    </label>
                    <textarea
                      className="glass-input min-h-[60px] sm:min-h-[80px] resize-y"
                      rows={2}
                      placeholder="توضیحات..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
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
                  <span>← بازگشت</span>
                </button>
              )}
              <div className="flex gap-2 sm:gap-3">
                {!editMode && formStep === 1 ? (
                  <button
                    onClick={() => {
                      if (!form.amount || Number(form.amount) <= 0) {
                        toast.warning("مبلغ را وارد کنید");
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
                    ادامه →
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
                    {editMode ? "ذخیره" : "ثبت"}
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
              آیا از حذف این تراکنش اطمینان دارید؟
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
