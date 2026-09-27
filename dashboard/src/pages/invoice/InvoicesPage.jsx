import { useEffect, useState } from "react";
import invoiceService from "../../services/invoiceService";
import companyService from "../../services/companyService";
import financeService from "../../services/financeService";
import {
  FileText,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Calendar,
  CreditCard,
  X,
  ChevronDown,
  Plus,
  Sparkles,
  Save,
} from "lucide-react";
import moment from "moment-jalaali";
import PersianDatePicker from "../../components/PersianDatePicker";
import { toast } from "../../components/Toast";
import DisabledButton from "../../components/DisabledButton";

moment.loadPersian({ dialect: "persian-modern" });

const statusConfig = {
  pending: {
    label: "در انتظار",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <Clock size={14} />,
  },
  partial: {
    label: "پرداخت جزئی",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: <TrendingDown size={14} />,
  },
  paid: {
    label: "پرداخت شده",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: <CheckCircle size={14} />,
  },
  overdue: {
    label: "عقب افتاده",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <AlertCircle size={14} />,
  },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [companies, setCompanies] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    moment().format("jYYYY-jMM-jDD"),
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    loadData("all");
  }, []);

  async function loadData(cf) {
    setLoading(true);
    try {
      const [ir, cr, dr] = await Promise.all([
        invoiceService.getAll(),
        companyService.getAll(),
        invoiceService.getCurrentDebt(),
      ]);
      setInvoices(ir?.data || []);
      setSummary(ir?.summary);
      setDebt(dr?.data);
      setCompanies(cr?.data || []);
      if (cf !== undefined) setSelectedCompany(cf);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function generateInvoice() {
    const now = moment();
    const gy = parseInt(now.format("YYYY"));
    const gm = parseInt(now.format("MM"));
    setConfirmMessage(`آیا از تولید صورتحساب ${gm}/${gy} اطمینان دارید؟`);
    setConfirmAction(() => async () => {
      setGenerating(true);
      try {
        await invoiceService.generateMonthly(gy, gm);
        toast.success("صورتحساب با موفقیت تولید شد 🎉");
        const [ir, cr, dr] = await Promise.all([
          invoiceService.getAll(),
          companyService.getAll(),
          invoiceService.getCurrentDebt(),
        ]);
        setInvoices(ir?.data || []);
        setSummary(ir?.summary);
        setDebt(dr?.data);
        setCompanies(cr?.data || []);
        setSelectedCompany("all");
      } catch (e) {
        toast.error(e.message || "خطا");
      }
      setGenerating(false);
    });
    setConfirmModal(true);
  }

  const openPaymentModal = (inv) => {
    setSelectedInvoice(inv);
    setPaymentAmount((inv.amount - inv.paidAmount).toString());
    setPaymentDate(moment().format("jYYYY-jMM-jDD"));
    setPaymentMethod("cash");
    setPaymentNotes(
      `پرداخت بابت ${inv.month}/${inv.year} - ${inv.company?.name}`,
    );
    setPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!selectedInvoice || !paymentAmount || Number(paymentAmount) <= 0) {
      toast.warning("لطفاً مبلغ را وارد کنید");
      return;
    }
    setSubmitting(true);
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      await financeService.create({
        teacher: u._id,
        company: selectedInvoice.company?._id,
        contract: selectedInvoice.contract?._id,
        amount: Number(paymentAmount),
        type: "income",
        date: moment(paymentDate, "jYYYY-jMM-jDD").format("YYYY-MM-DD"),
        paymentMethod,
        description: paymentNotes,
        category: "پرداخت صورتحساب",
      });
      toast.success("پرداخت ثبت شد ✨");
      setPaymentModal(false);
      const [ir] = await Promise.all([invoiceService.getAll()]);
      setInvoices(ir?.data || []);
      setSummary(ir?.summary);
    } catch (e) {
      toast.error("خطا: " + e.message);
    }
    setSubmitting(false);
  };

  const formatMoney = (n) => (!n ? "0" : Number(n).toLocaleString());
  const filteredInvoices =
    selectedCompany === "all"
      ? invoices
      : invoices.filter((inv) => inv.company?._id === selectedCompany);

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen" dir="rtl">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 100% { box-shadow: 0 0 0 20px rgba(139,92,246,0); } }
        
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 12px 14px; font-size: .85rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 14px 16px; font-size: .9rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08); background: rgba(15,23,42,0.95)!important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.15); font-size: 0.8rem; }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .stat-card { border-radius: 18px; padding: 18px; } }
        .invoice-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 14px; transition: all .3s; }
        @media (min-width: 640px) { .invoice-card { border-radius: 18px; padding: 18px; } }
        .invoice-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .icon-circle { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        @media (min-width: 640px) { .icon-circle { width: 40px; height: 40px; border-radius: 12px; } }
        .progress-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); overflow: hidden; }
        @media (min-width: 640px) { .progress-bar { height: 8px; border-radius: 4px; } }
        .progress-fill { height: 100%; border-radius: 3px; transition: width .6s ease; background: linear-gradient(90deg, #10b981, #059669); }
        
        .dds-trigger { background: rgba(17,24,39,0.9); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; padding: 12px 14px; font-size: 0.85rem; text-align: right; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; width: 100%; }
        @media (min-width: 640px) { .dds-trigger { padding: 14px 16px; font-size: 0.9rem; } }
        .dds-trigger:hover { border-color: rgba(139,92,246,0.3); }
        .dds-trigger.open { border-color: rgba(139,92,246,0.5); border-radius: 12px 12px 0 0; }
        .dds-options { position: absolute; top: 100%; left: 0; right: 0; background: rgba(17,24,39,0.98); border: 1px solid rgba(139,92,246,0.2); border-top: none; border-radius: 0 0 12px 12px; z-index: 20; max-height: 220px; overflow-y: auto; animation: ddsSlide 0.15s; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
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
        
        select.glass-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 14px center; padding-left: 36px; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            صورتحساب‌ها
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            مدیریت بدهی‌ها و صورت‌حساب‌های ماهانه
          </p>
        </div>
        <DisabledButton
          feature="invoices"
          onClick={generateInvoice}
          className="create-btn"
        >
          <Plus size={22} />
          <span>ایجاد صورت حساب جدید</span>
        </DisabledButton>
      </div>

      {/* Debt Alert */}
      {debt && debt.totalDebt > 0 && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="icon-circle bg-amber-500/20">
                <AlertCircle
                  size={18}
                  className="sm:w-[22px] sm:h-[22px] text-amber-400"
                />
              </div>
              <div>
                <p className="text-amber-400 text-xs sm:text-sm mb-0.5 sm:mb-1">
                  بدهی جاری
                </p>
                <span className="text-xl sm:text-3xl font-bold text-amber-400">
                  {formatMoney(debt.totalDebt)}{" "}
                  <span className="text-sm sm:text-lg font-normal text-amber-400/70">
                    تومان
                  </span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg sm:text-2xl font-bold text-white">
                {debt.invoicesCount}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-400">
                پرداخت نشده
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {[
            {
              label: "مجموع",
              value: summary.totalAmount,
              color: "text-white",
              bg: "bg-blue-500/10",
              icon: (
                <FileText
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-blue-400"
                />
              ),
            },
            {
              label: "پرداخت شده",
              value: summary.totalPaidAmount,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              icon: (
                <CheckCircle
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-emerald-400"
                />
              ),
            },
            {
              label: "باقی‌مانده",
              value: summary.totalRemaining,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              icon: (
                <Clock
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-amber-400"
                />
              ),
            },
            {
              label: "عقب افتاده",
              value: summary.overdue || 0,
              color: "text-red-400",
              bg: "bg-red-500/10",
              icon: (
                <AlertCircle
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-red-400"
                />
              ),
            },
          ].map((s, i) => (
            <div
              key={i}
              className="stat-card text-right"
              style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className={`icon-circle ${s.bg}`}>{s.icon}</div>
              </div>
              <div className={`text-lg sm:text-2xl font-extrabold ${s.color}`}>
                {typeof s.value === "number" ? formatMoney(s.value) : s.value}
              </div>
              <div className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Filter */}
      <div className="mb-6 sm:mb-8">
        <div style={{ position: "relative", width: "100%", maxWidth: "280px" }}>
          <div
            className={`dds-trigger ${companyOpen ? "open" : ""}`}
            onClick={() => setCompanyOpen(!companyOpen)}
          >
            <span className="flex items-center gap-2 truncate">
              <Building2
                size={14}
                className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
              />
              <span className="text-white text-xs sm:text-sm truncate">
                {selectedCompany === "all"
                  ? "🏢 همه شرکت‌ها"
                  : companies.find((c) => c._id === selectedCompany)?.name ||
                    "انتخاب شرکت"}
              </span>
            </span>
            <ChevronDown
              size={14}
              className="sm:w-4 sm:h-4 transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''} text-purple-400 flex-shrink-0"
            />
          </div>
          {companyOpen && (
            <>
              <div
                className="dds-overlay"
                onClick={() => setCompanyOpen(false)}
              />
              <div className="dds-options">
                <div
                  className={`dds-option ${selectedCompany === "all" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedCompany("all");
                    setCompanyOpen(false);
                  }}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                    🏢
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm">همه شرکت‌ها</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {invoices.length}
                  </span>
                  {selectedCompany === "all" && (
                    <span style={{ color: "#a78bfa", fontWeight: "bold" }}>
                      ✓
                    </span>
                  )}
                </div>
                {companies.map((c) => (
                  <div
                    key={c._id}
                    className={`dds-option ${selectedCompany === c._id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedCompany(c._id);
                      setCompanyOpen(false);
                    }}
                  >
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                      {c.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm">{c.name}</span>
                      {c.managerName && (
                        <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                          {c.managerName}
                        </p>
                      )}
                    </div>
                    {selectedCompany === c._id && (
                      <span style={{ color: "#a78bfa", fontWeight: "bold" }}>
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoices List */}
      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 sm:p-16 text-center">
          <FileText
            size={36}
            className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-30"
          />
          <p className="text-gray-400 text-sm sm:text-lg">
            هیچ صورتحسابی یافت نشد
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredInvoices.map((inv) => {
            const rem = inv.amount - inv.paidAmount;
            const pct =
              inv.amount > 0 ? (inv.paidAmount / inv.amount) * 100 : 0;
            const paid = inv.status === "paid";
            return (
              <div key={inv._id} className="invoice-card">
                <div className="flex flex-wrap justify-between items-start gap-3 sm:gap-4 mb-2.5 sm:mb-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="icon-circle bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                      {inv.company?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm sm:text-base truncate">
                        {inv.company?.name || "بدون نام"}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                        <Calendar
                          size={10}
                          className="sm:w-[11px] sm:h-[11px]"
                        />
                        {inv.month}/{inv.year}
                        <span className="text-gray-600">|</span>
                        {inv.contract?.title || "بدون قرارداد"}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {formatMoney(inv.amount)}{" "}
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        تومان
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border mt-1 sm:mt-1.5 ${statusConfig[inv.status]?.color}`}
                    >
                      {statusConfig[inv.status]?.icon}
                      {statusConfig[inv.status]?.label}
                    </span>
                  </div>
                </div>
                <div className="mb-2.5 sm:mb-3">
                  <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-500 mb-1 sm:mb-1.5">
                    <span>پرداخت: {formatMoney(inv.paidAmount)}</span>
                    <span>باقی: {formatMoney(rem)}</span>
                    <span className="text-white">{Math.round(pct)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-white/5">
                  <span className="text-[9px] sm:text-[10px] text-gray-600 flex items-center gap-1">
                    <Clock size={9} className="sm:w-2.5 sm:h-2.5" />
                    {inv.totalHours || 0} ساعت
                  </span>
                  {!paid && rem > 0 && (
                    <button
                      onClick={() => openPaymentModal(inv)}
                      className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium transition"
                    >
                      <CreditCard size={11} className="sm:w-3 sm:h-3" />
                      پرداخت
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div
            className="w-full max-w-[95vw] sm:max-w-[480px] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0f172a 0%, #0a0f1a 100%)",
              animation: "modalSlideUp 0.3s ease-out",
            }}
            dir="rtl"
          >
            <div
              className="p-4 sm:p-6 pb-2 sm:pb-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.03) 50%, transparent 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <CreditCard
                      size={18}
                      className="sm:w-[22px] sm:h-[22px] text-white"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      ثبت پرداخت
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                      {selectedInvoice.company?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentModal(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center"
                >
                  <X
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-gray-400"
                  />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 pt-2 sm:pt-3 space-y-3 sm:space-y-4">
              <div className="bg-white/[0.02] rounded-xl p-2.5 sm:p-3 space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">مبلغ کل</span>
                  <span className="text-white font-bold">
                    {formatMoney(selectedInvoice.amount)} تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">پرداخت شده</span>
                  <span className="text-emerald-400">
                    {formatMoney(selectedInvoice.paidAmount)} تومان
                  </span>
                </div>
                <div className="flex justify-between pt-1 sm:pt-1.5 border-t border-white/5">
                  <span className="text-gray-500">باقی‌مانده</span>
                  <span className="text-amber-400 font-bold">
                    {formatMoney(
                      selectedInvoice.amount - selectedInvoice.paidAmount,
                    )}{" "}
                    تومان
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 mr-1">
                  مبلغ پرداختی *
                </label>
                <input
                  type="number"
                  className="glass-input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="مبلغ"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 mr-1">
                  تاریخ
                </label>
                <PersianDatePicker
                  value={paymentDate}
                  onChange={setPaymentDate}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 mr-1">
                    روش
                  </label>
                  <select
                    className="glass-input"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">نقد</option>
                    <option value="card">کارت</option>
                    <option value="transfer">انتقال</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 mr-1">
                  توضیحات
                </label>
                <textarea
                  className="glass-input min-h-[60px] sm:min-h-[70px] resize-y"
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button
                  onClick={submitPayment}
                  disabled={submitting}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                  }}
                >
                  <Save size={14} className="sm:w-4 sm:h-4" />
                  {submitting ? "در حال ثبت..." : "تأیید پرداخت"}
                </button>
                <button
                  onClick={() => setPaymentModal(false)}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gray-700/50 text-xs sm:text-sm"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-[90vw] sm:max-w-[400px] rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 text-center"
            style={{
              background: "linear-gradient(160deg, #0f172a 0%, #0a0f1a 100%)",
              animation: "modalSlideUp 0.3s ease-out",
            }}
            dir="rtl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <AlertCircle size={24} className="sm:w-7 sm:h-7 text-amber-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">
              تأیید
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6">
              {confirmMessage}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  if (confirmAction) confirmAction();
                  setConfirmModal(false);
                }}
                className="flex-1 py-2 sm:py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                }}
              >
                بله
              </button>
              <button
                onClick={() => setConfirmModal(false)}
                className="flex-1 py-2 sm:py-2.5 rounded-xl bg-gray-700/50 text-xs sm:text-sm"
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
