import { useEffect, useState } from "react";
import companyService from "../../services/companyService";
import moment from "moment-jalaali";
import { toast } from "../../components/Toast";
import {
  ChevronDown,
  Plus,
  Building2,
  Users,
  Phone,
  Edit3,
  Eye,
  Trash2,
  X,
  MapPin,
  Mail,
  AlertCircle,
  Save,
  Sparkles,
  User,
} from "lucide-react";
import DisabledButton from "../../components/DisabledButton";

moment.loadPersian({ dialect: "persian-modern" });

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [managerFilter, setManagerFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [managerOpen, setManagerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    managerName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [formStep, setFormStep] = useState(1);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    setLoading(true);
    try {
      const res = await companyService.getAll();
      setCompanies(res?.data || res || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const openCreateModal = () => {
    setForm({
      name: "",
      managerName: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setEditMode(false);
    setFormStep(1);
    setModalOpen(true);
  };

  const openEditModal = (company) => {
    setForm({
      name: company.name || "",
      managerName: company.managerName || "",
      phone: company.phone || "",
      email: company.email || "",
      address: company.address || "",
      notes: company.notes || "",
    });
    setSelectedCompany(company);
    setEditMode(true);
    setFormStep(1);
    setModalOpen(true);
  };

  const openDetailModal = (company) => {
    setSelectedCompany(company);
    setDetailModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("نام مؤسسه الزامی است");
      return;
    }
    try {
      if (editMode) {
        await companyService.update(selectedCompany._id, form);
        toast.success("مؤسسه ویرایش شد ✨");
      } else {
        await companyService.create(form);
        toast.success("مؤسسه جدید با موفقیت ایجاد شد 🎉");
      }
      setModalOpen(false);
      loadCompanies();
    } catch (err) {
      console.error(err);
      toast.error("خطا در ذخیره مؤسسه");
    }
  }

  async function handleDelete(id) {
    try {
      await companyService.remove(id);
      setDeleteConfirm(null);
      loadCompanies();
      toast.success("مؤسسه حذف شد");
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف مؤسسه");
    }
  }

  const formatDate = (date) => {
    if (!date) return "-";
    const m = moment(date);
    return m.isValid() ? m.format("jYYYY-jMM-jDD") : "-";
  };

  const filteredCompanies = companies
    .filter((c) => {
      const ms =
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const mm =
        managerFilter === "all" ||
        (managerFilter === "with_manager" && c.managerName) ||
        (managerFilter === "without_manager" && !c.managerName);
      const mc =
        contactFilter === "all" ||
        (contactFilter === "with_phone" && c.phone) ||
        (contactFilter === "with_email" && c.email) ||
        (contactFilter === "with_address" && c.address) ||
        (contactFilter === "full_info" && c.phone && c.email && c.address);
      return ms && mm && mc;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "", "fa");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "", "fa");
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const FilterDropdown = ({
    open,
    setOpen,
    value,
    options,
    onChange,
    placeholder,
  }) => (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className={`dds-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        style={{ padding: "12px 14px", fontSize: "0.85rem" }}
      >
        <span className="flex items-center gap-2 text-sm text-white">
          <span>{options.find((o) => o.value === value)?.icon}</span>
          <span className="truncate">
            {options.find((o) => o.value === value)?.label || placeholder}
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
                <span className="text-base">{opt.icon}</span>
                <span className="text-sm">{opt.label}</span>
                {value === opt.value && (
                  <span
                    style={{
                      marginRight: "auto",
                      color: "#a78bfa",
                      fontWeight: "bold",
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
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 100% { box-shadow: 0 0 0 20px rgba(139,92,246,0); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
        
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 12px 44px 12px 14px; font-size: .85rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 14px 48px 14px 16px; font-size: .9rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08), 0 0 20px rgba(139,92,246,0.05); background: rgba(15,23,42,0.95)!important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.15); font-size: 0.8rem; }
        
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .stat-card { padding: 18px; } }
        .company-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .company-card { padding: 18px; } }
        .company-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .avatar-circle { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
        @media (min-width: 640px) { .avatar-circle { width: 44px; height: 44px; border-radius: 14px; font-size: 1.1rem; } }
        
        .dds-trigger { width: 100%; background: rgba(17,24,39,0.9); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; text-align: right; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; }
        .dds-trigger:hover { border-color: rgba(139,92,246,0.3); background: rgba(255,255,255,0.05); }
        .dds-trigger.open { border-color: rgba(139,92,246,0.5); border-radius: 12px 12px 0 0; }
        .dds-options { position: absolute; top: 100%; left: 0; right: 0; background: rgba(17,24,39,0.98); border: 1px solid rgba(139,92,246,0.2); border-top: none; border-radius: 0 0 12px 12px; z-index: 20; max-height: 200px; overflow-y: auto; animation: ddsSlide 0.15s; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        @keyframes ddsSlide { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .dds-option { padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.02); color: #cbd5e1; font-size: 0.8rem; }
        @media (min-width: 640px) { .dds-option { padding: 11px 16px; font-size: 0.85rem; } }
        .dds-option:hover { background: rgba(139,92,246,0.08); color: #fff; }
        .dds-option.selected { background: rgba(139,92,246,0.12); color: #fff; font-weight: 600; }
        .dds-overlay { position: fixed; inset: 0; z-index: 15; }

        .create-btn {
          position: relative; background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);
          background-size: 200% 200%; animation: gradient-shift 4s ease infinite;
          padding: 12px 22px; border-radius: 14px; color: white; font-weight: 700;
          font-size: 0.85rem; border: none; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 8px 30px rgba(139,92,246,0.3); overflow: hidden;
          display: flex; align-items: center; gap: 8px;
        }
        @media (min-width: 640px) { .create-btn { padding: 14px 28px; border-radius: 16px; font-size: 0.95rem; gap: 10px; } }
        .create-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(139,92,246,0.45); }
        .create-btn:active { transform: scale(0.96); }
        .create-btn .pulse-dot { position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; border-radius: 50%; background: #fbbf24; animation: pulse-ring 2s infinite; }
        @media (min-width: 640px) { .create-btn .pulse-dot { width: 12px; height: 12px; } }

        .modal-overlay { background: rgba(0,0,0,0.75); backdrop-filter: blur(12px); }
        .modal-card { background: linear-gradient(160deg, #0f172a 0%, #0a0f1a 100%); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 24px; box-shadow: 0 30px 70px rgba(0,0,0,0.6); animation: modalSlideUp 0.35s; overflow: hidden; width: 95vw; max-width: 600px; max-height: 90vh; }
        @media (min-width: 640px) { .modal-card { border-radius: 32px; width: 100%; } }
        
        .modal-header-bg { background: linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.04) 50%, transparent 100%); padding: 20px 20px 16px; }
        @media (min-width: 640px) { .modal-header-bg { padding: 28px 32px 20px; } }

        .step-dot { width: 30px; height: 30px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; transition: all 0.3s; background: rgba(255,255,255,0.04); color: #64748b; border: 1.5px solid rgba(255,255,255,0.06); flex-shrink: 0; }
        @media (min-width: 640px) { .step-dot { width: 36px; height: 36px; border-radius: 12px; font-size: 0.8rem; } }
        .step-dot.active { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-color: transparent; box-shadow: 0 4px 15px rgba(139,92,246,0.3); }
        .step-dot.done { background: rgba(16,185,129,0.15); color: #10b981; border-color: rgba(16,185,129,0.3); }
        .step-line { flex: 1; height: 1.5px; background: rgba(255,255,255,0.06); }
        .step-line.done { background: rgba(16,185,129,0.3); }

        .input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.2); pointer-events: none; }
        @media (min-width: 640px) { .input-icon { right: 16px; } }
        .glass-input:focus ~ .input-icon { color: #a78bfa; }

        .submit-btn { background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899); background-size: 200% 200%; animation: gradient-shift 3s ease infinite; position: relative; overflow: hidden; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            مدیریت مؤسسات
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            مشاهده و مدیریت اطلاعات مؤسسات آموزشی
          </p>
        </div>
        <DisabledButton
          feature="companies"
          onClick={openCreateModal}
          className="create-btn"
        >
          <Plus size={22} />
          <span>ایجاد مؤسسه جدید</span>
        </DisabledButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: "کل مؤسسات",
            value: companies.length,
            icon: <Building2 size={18} className="sm:w-5 sm:h-5" />,
            bg: "bg-blue-500/10",
            color: "text-blue-400",
          },
          {
            label: "مدیران ثبت‌شده",
            value: companies.filter((c) => c.managerName).length,
            icon: <Users size={18} className="sm:w-5 sm:h-5" />,
            bg: "bg-purple-500/10",
            color: "text-purple-400",
          },
          {
            label: "دارای تماس",
            value: companies.filter((c) => c.phone).length,
            icon: <Phone size={18} className="sm:w-5 sm:h-5" />,
            bg: "bg-emerald-500/10",
            color: "text-emerald-400",
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
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}
              >
                {s.icon}
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
            placeholder="جستجو در مؤسسات..."
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
          <div className="flex-1 sm:flex-initial sm:w-[150px] md:w-[180px]">
            <FilterDropdown
              open={managerOpen}
              setOpen={setManagerOpen}
              value={managerFilter}
              onChange={setManagerFilter}
              options={[
                { value: "all", label: "همه", icon: "👥" },
                { value: "with_manager", label: "مدیر دارد", icon: "👤" },
                { value: "without_manager", label: "بدون مدیر", icon: "❌" },
              ]}
              placeholder="مدیر"
            />
          </div>
          <div className="flex-1 sm:flex-initial sm:w-[150px] md:w-[180px]">
            <FilterDropdown
              open={contactOpen}
              setOpen={setContactOpen}
              value={contactFilter}
              onChange={setContactFilter}
              options={[
                { value: "all", label: "همه", icon: "📋" },
                { value: "with_phone", label: "شماره", icon: "📞" },
                { value: "with_email", label: "ایمیل", icon: "✉️" },
                { value: "with_address", label: "آدرس", icon: "📍" },
                { value: "full_info", label: "کامل", icon: "✅" },
              ]}
              placeholder="اطلاعات"
            />
          </div>
          <div className="flex-1 sm:flex-initial sm:w-[140px] md:w-[160px]">
            <FilterDropdown
              open={sortOpen}
              setOpen={setSortOpen}
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "newest", label: "جدیدترین", icon: "🆕" },
                { value: "oldest", label: "قدیمی‌ترین", icon: "📅" },
                { value: "name_asc", label: "الف تا ی", icon: "🔤" },
                { value: "name_desc", label: "ی تا الف", icon: "🔠" },
              ]}
              placeholder="مرتب‌سازی"
            />
          </div>
        </div>

        {(searchTerm ||
          managerFilter !== "all" ||
          contactFilter !== "all" ||
          sortBy !== "newest") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setManagerFilter("all");
              setContactFilter("all");
              setSortBy("newest");
            }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all"
          >
            <X size={14} />
            <span className="hidden sm:inline">حذف فیلترها</span>
          </button>
        )}
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 sm:p-16 text-center">
          <Building2
            size={36}
            className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-30"
          />
          <p className="text-gray-400 text-sm sm:text-lg">
            {searchTerm ? "مؤسسه‌ای یافت نشد" : "هنوز مؤسسه‌ای ثبت نکردی!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredCompanies.map((company) => (
            <div key={company._id} className="company-card">
              <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                <div className="avatar-circle bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {company.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base truncate">
                    {company.name}
                  </h3>
                  {company.managerName && (
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Users size={10} className="sm:w-[11px] sm:h-[11px]" />
                      {company.managerName}
                    </p>
                  )}
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 sm:mt-1">
                    {formatDate(company.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
                {company.phone && (
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                    <Phone size={8} className="sm:w-[9px] sm:h-[9px]" />
                    {company.phone}
                  </span>
                )}
                {company.email && (
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1">
                    <Mail size={8} className="sm:w-[9px] sm:h-[9px]" />
                    {company.email}
                  </span>
                )}
                {company.address && (
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 flex items-center gap-1">
                    <MapPin size={8} className="sm:w-[9px] sm:h-[9px]" />
                    آدرس
                  </span>
                )}
              </div>
              <div className="flex gap-1 sm:gap-1.5 pt-2.5 sm:pt-3 border-t border-white/5">
                <button
                  onClick={() => openDetailModal(company)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] sm:text-xs flex items-center justify-center gap-1"
                >
                  <Eye size={11} className="sm:w-[13px] sm:h-[13px]" />
                  جزئیات
                </button>
                <button
                  onClick={() => openEditModal(company)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs"
                >
                  <Edit3 size={11} className="sm:w-[13px] sm:h-[13px]" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(company._id)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] sm:text-xs"
                >
                  <Trash2 size={11} className="sm:w-[13px] sm:h-[13px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="modal-card overflow-y-auto">
            <div className="modal-header-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl"
                    style={{ animation: "float 3s ease-in-out infinite" }}
                  >
                    {editMode ? (
                      <Edit3 size={18} className="sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <Building2
                        size={18}
                        className="sm:w-6 sm:h-6 text-white"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                      {editMode ? "ویرایش مؤسسه" : "مؤسسه جدید"}
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                      {editMode ? "ویرایش اطلاعات" : "ثبت مؤسسه آموزشی جدید"}
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
                </div>
              )}
            </div>

            <div className="px-5 sm:px-8 py-4 sm:py-6">
              <form onSubmit={handleSubmit} id="companyForm">
                {(!editMode && formStep === 1) || editMode ? (
                  <div className="space-y-3 sm:space-y-5">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        نام مؤسسه <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="مثال: آموزشگاه زبان پارس"
                          className="glass-input"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                          autoFocus
                        />
                        <Building2
                          size={16}
                          className="sm:w-[18px] sm:h-[18px] input-icon"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                          نام مدیر
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="نام و نام خانوادگی"
                            className="glass-input"
                            value={form.managerName}
                            onChange={(e) =>
                              setForm({ ...form, managerName: e.target.value })
                            }
                          />
                          <User
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] input-icon"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                          شماره تماس
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            className="glass-input"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            dir="ltr"
                          />
                          <Phone
                            size={16}
                            className="sm:w-[18px] sm:h-[18px] input-icon"
                          />
                        </div>
                      </div>
                    </div>
                    {editMode && (
                      <>
                        <div>
                          <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                            ایمیل
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              placeholder="example@email.com"
                              className="glass-input"
                              value={form.email}
                              onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                              }
                              dir="ltr"
                            />
                            <Mail
                              size={16}
                              className="sm:w-[18px] sm:h-[18px] input-icon"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                            آدرس
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="آدرس"
                              className="glass-input"
                              value={form.address}
                              onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                              }
                            />
                            <MapPin
                              size={16}
                              className="sm:w-[18px] sm:h-[18px] input-icon"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                            یادداشت
                          </label>
                          <textarea
                            className="glass-input min-h-[60px] sm:min-h-[80px] resize-y"
                            value={form.notes}
                            onChange={(e) =>
                              setForm({ ...form, notes: e.target.value })
                            }
                            rows={2}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-5">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        ایمیل
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="example@email.com"
                          className="glass-input"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          dir="ltr"
                        />
                        <Mail
                          size={16}
                          className="sm:w-[18px] sm:h-[18px] input-icon"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        آدرس
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="آدرس"
                          className="glass-input"
                          value={form.address}
                          onChange={(e) =>
                            setForm({ ...form, address: e.target.value })
                          }
                        />
                        <MapPin
                          size={16}
                          className="sm:w-[18px] sm:h-[18px] input-icon"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 font-medium">
                        یادداشت
                      </label>
                      <textarea
                        className="glass-input min-h-[60px] sm:min-h-[80px] resize-y"
                        value={form.notes}
                        onChange={(e) =>
                          setForm({ ...form, notes: e.target.value })
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="px-5 sm:px-8 pb-5 sm:pb-6 pt-1 sm:pt-2">
              {!editMode && formStep === 2 && (
                <button
                  onClick={() => setFormStep(1)}
                  className="w-full mb-2 sm:mb-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 hover:text-white transition"
                >
                  ← بازگشت
                </button>
              )}
              <div className="flex gap-2 sm:gap-3">
                {!editMode && formStep === 1 && (
                  <button
                    onClick={() => {
                      if (!form.name.trim()) {
                        toast.warning("نام مؤسسه را وارد کنید");
                        return;
                      }
                      setFormStep(2);
                    }}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition"
                  >
                    ادامه →
                  </button>
                )}
                {(editMode || formStep === 2) && (
                  <button
                    type="submit"
                    form="companyForm"
                    className="submit-btn flex-1 py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>{editMode ? "ذخیره" : "ایجاد مؤسسه"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium text-xs sm:text-sm transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="glass-card p-5 sm:p-6 rounded-2xl w-full max-w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-y-auto"
            dir="rtl"
            style={{ animation: "modalSlideUp 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold">جزئیات مؤسسه</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            <div className="text-center mb-4 sm:mb-5">
              <div className="avatar-circle w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 text-xl sm:text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {selectedCompany.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                {selectedCompany.name}
              </h3>
              {selectedCompany.createdAt && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                  ثبت: {formatDate(selectedCompany.createdAt)}
                </p>
              )}
            </div>
            <div className="space-y-2 sm:space-y-3">
              {selectedCompany.managerName && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">مدیر</span>
                  <span className="text-white text-xs sm:text-sm">
                    {selectedCompany.managerName}
                  </span>
                </div>
              )}
              {selectedCompany.phone && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">تلفن</span>
                  <span className="text-white text-xs sm:text-sm" dir="ltr">
                    {selectedCompany.phone}
                  </span>
                </div>
              )}
              {selectedCompany.email && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">
                    ایمیل
                  </span>
                  <span className="text-white text-xs sm:text-sm">
                    {selectedCompany.email}
                  </span>
                </div>
              )}
              {selectedCompany.address && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">آدرس</span>
                  <span className="text-white text-xs sm:text-sm">
                    {selectedCompany.address}
                  </span>
                </div>
              )}
              {selectedCompany.notes && (
                <div className="py-1.5 sm:py-2">
                  <span className="text-gray-400 text-xs sm:text-sm block mb-1">
                    یادداشت
                  </span>
                  <p className="text-white/70 text-xs sm:text-sm bg-white/5 p-2 sm:p-3 rounded-xl">
                    {selectedCompany.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(selectedCompany);
                }}
                className="flex-1 py-2 sm:py-2.5 bg-blue-600/70 hover:bg-blue-600 rounded-xl text-xs sm:text-sm font-medium transition"
              >
                ویرایش
              </button>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="flex-1 py-2 sm:py-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-xs sm:text-sm transition"
              >
                بستن
              </button>
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
              آیا از حذف این مؤسسه اطمینان دارید؟
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-xs sm:text-sm"
              >
                بله، حذف
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
