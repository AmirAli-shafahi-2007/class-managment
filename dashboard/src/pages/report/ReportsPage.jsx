import { useEffect, useState, useRef } from "react";
import reportService from "../../services/reportService";
import { toast } from "../../components/Toast";
import {
  Calendar,
  Building2,
  DollarSign,
  Clock,
  BookOpen,
  TrendingUp,
  FileText,
  Download,
  GraduationCap,
  RefreshCw,
  X,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { printReport, generateExcel } from "../../utils/pdfGenerator";
import PersianDatePicker from "../../components/PersianDatePicker";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];
const formatXAxis = (t) => {
  if (!t) return "";
  const m = moment(t);
  return m.isValid() ? m.format("jDD jMMMM") : t;
};
const formatFullDate = (d) => {
  if (!d) return "";
  const m = moment(d);
  return m.isValid() ? m.format("jYYYY/jMM/jDD") : d;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monthly");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef(null);
  const [monthlyTeaching, setMonthlyTeaching] = useState(null);
  const [companyTeaching, setCompanyTeaching] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [incomeRange, setIncomeRange] = useState(null);
  const [companiesRange, setCompaniesRange] = useState([]);
  const [contractsReport, setContractsReport] = useState([]);
  const [classesSummary, setClassesSummary] = useState(null);
  const [classesChart, setClassesChart] = useState(null);
  const [teachingChart, setTeachingChart] = useState(null);
  const [companyChart, setCompanyChart] = useState(null);
  const [incomeChart, setIncomeChart] = useState(null);
  const [rangeChart, setRangeChart] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [incomeStartDate, setIncomeStartDate] = useState("");
  const [incomeEndDate, setIncomeEndDate] = useState("");
  const [classesStartDate, setClassesStartDate] = useState("");
  const [classesEndDate, setClassesEndDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companiesList, setCompaniesList] = useState([]);
  const [monthlyStartDate, setMonthlyStartDate] = useState("");
  const [monthlyEndDate, setMonthlyEndDate] = useState("");
  const [companiesStartDate, setCompaniesStartDate] = useState("");
  const [companiesEndDate, setCompaniesEndDate] = useState("");
  const [companyOpen, setCompanyOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(e.target)
      )
        setShowDownloadMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toGreg = (d) => {
    if (!d) return null;
    const m = moment(d, "jYYYY-jMM-jDD");
    return m.isValid() ? m.format("YYYY-MM-DD") : null;
  };
  useEffect(() => {
    loadReports();
    loadContractsReport();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const [m, c, i] = await Promise.all([
        reportService.monthlyTeaching(
          moment().jYear(),
          moment().jMonth() + 1,
          selectedCompany,
        ),
        reportService.teachingByCompany(selectedCompany),
        reportService.monthlyIncome(
          moment().jYear(),
          moment().jMonth() + 1,
          selectedCompany,
        ),
      ]);
      setMonthlyTeaching(m?.data?.[0] || null);
      setTeachingChart(m?.chart);
      setCompanyTeaching(c?.data || []);
      setCompanyChart(c?.chart);
      setMonthlyIncome(i?.data || []);
      setIncomeChart(i?.chart);
      if (c?.data)
        setCompaniesList(c.data.map((x) => ({ id: x.companyId, name: x._id })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  async function loadContractsReport() {
    try {
      const r = await reportService.contractsReport();
      setContractsReport(r?.data || []);
    } catch (e) {
      console.error(e);
    }
  }
  async function loadMonthlyReport() {
    if (!monthlyStartDate || !monthlyEndDate) {
      toast.warning("بازه را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const m = await reportService.monthlyTeachingRange(
        toGreg(monthlyStartDate),
        toGreg(monthlyEndDate),
        selectedCompany,
      );
      setMonthlyTeaching(m?.data?.[0] || null);
      setTeachingChart(m?.chart);
    } catch (e) {
      toast.error("خطا");
    }
    setLoading(false);
  }
  async function loadCompaniesReport() {
    if (!companiesStartDate || !companiesEndDate) {
      toast.warning("بازه را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const c = await reportService.teachingByCompanyRange(
        toGreg(companiesStartDate),
        toGreg(companiesEndDate),
        selectedCompany,
      );
      setCompanyTeaching(c?.data || []);
      setCompanyChart(c?.chart);
      if (c?.data)
        setCompaniesList(c.data.map((x) => ({ id: x.companyId, name: x._id })));
    } catch (e) {
      toast.error("خطا");
    }
    setLoading(false);
  }
  async function loadClassesReport() {
    if (!classesStartDate || !classesEndDate) {
      toast.warning("بازه را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const r = await reportService.classesReport(
        toGreg(classesStartDate),
        toGreg(classesEndDate),
        selectedCompany,
      );
      if (r?.success) {
        setClassesSummary(r?.summary);
        setClassesChart(r?.chart);
      }
    } catch (e) {
      toast.error("خطا");
    }
    setLoading(false);
  }
  async function loadRangeReports() {
    if (!startDate || !endDate) {
      toast.warning("بازه را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const [i, c] = await Promise.all([
        reportService.incomeByDateRange(
          toGreg(startDate),
          toGreg(endDate),
          selectedCompany,
        ),
        reportService.companiesByDateRange(
          toGreg(startDate),
          toGreg(endDate),
          selectedCompany,
        ),
      ]);
      setIncomeRange(i?.data?.[0] || null);
      setRangeChart(i?.chart);
      setCompaniesRange(c?.data || []);
    } catch (e) {
      toast.error("خطا");
    }
    setLoading(false);
  }
  async function loadIncomeRangeReports() {
    if (!incomeStartDate || !incomeEndDate) {
      toast.warning("بازه را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const i = await reportService.incomeByDateRange(
        toGreg(incomeStartDate),
        toGreg(incomeEndDate),
        selectedCompany,
      );
      setIncomeRange(i?.data?.[0] || null);
      setIncomeChart(i?.chart);
    } catch (e) {
      toast.error("خطا");
    }
    setLoading(false);
  }

  const formatMoney = (n) => (!n && n !== 0 ? "0" : Number(n).toLocaleString());
  const tabs = [
    { id: "monthly", label: "ماهانه", icon: <Calendar size={14} /> },
    { id: "companies", label: "شرکت‌ها", icon: <Building2 size={14} /> },
    { id: "income", label: "درآمد", icon: <DollarSign size={14} /> },
    { id: "contracts", label: "قراردادها", icon: <FileText size={14} /> },
    { id: "classes", label: "کلاس‌ها", icon: <GraduationCap size={14} /> },
    { id: "range", label: "بازه", icon: <TrendingUp size={14} /> },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{formatFullDate(label)}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}:{" "}
              {typeof p.value === "number" ? formatMoney(p.value) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLineChart = (data, title) => {
    if (!data?.labels?.length) return null;
    const cd = data.labels.map((l, i) => ({
      name: l,
      value: data.datasets[0]?.data[i] || 0,
    }));
    return (
      <div className="bg-white/[0.02] rounded-xl p-3 sm:p-5 border border-white/5">
        <h4 className="text-sm font-bold mb-4 text-gray-300">{title}</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cd}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 10 }}
              tickFormatter={formatXAxis}
              height={45}
            />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  const renderBarChart = (data, title) => {
    if (!data?.labels?.length) return null;
    const ds = data.datasets || [];
    const cd = data.labels.map((l, i) => ({
      name: l,
      [ds[0]?.label || "v1"]: ds[0]?.data[i] || 0,
      [ds[1]?.label || "v2"]: ds[1]?.data[i] || 0,
    }));
    return (
      <div className="bg-white/[0.02] rounded-xl p-3 sm:p-5 border border-white/5">
        <h4 className="text-sm font-bold mb-4 text-gray-300">{title}</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cd}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 10 }}
              tickFormatter={formatXAxis}
              height={45}
            />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {ds[0] && (
              <Bar dataKey={ds[0].label} fill="#10b981" radius={[6, 6, 0, 0]} />
            )}
            {ds[1] && (
              <Bar dataKey={ds[1].label} fill="#f59e0b" radius={[6, 6, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  const renderPieChart = (data) => {
    if (!data?.labels?.length) return null;
    const pd = data.labels.map((l, i) => ({
      name: l,
      value: data.datasets[0]?.data[i] || 0,
    }));
    return (
      <div className="bg-white/[0.02] rounded-xl p-3 sm:p-5 border border-white/5">
        <h4 className="text-sm font-bold mb-4 text-gray-300 text-center">
          ساعات تدریس
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pd}
              cx="50%"
              cy="50%"
              outerRadius={65}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {pd.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const getCSVData = () => {
    switch (activeTab) {
      case "monthly":
        return monthlyTeaching
          ? [
              {
                کلاس: monthlyTeaching.totalClasses || 0,
                ساعت: monthlyTeaching.totalHours || 0,
              },
            ]
          : [];
      case "companies":
        return companyTeaching.map((i) => ({
          شرکت: i._id,
          ساعت: i.totalHours,
          کلاس: i.totalClasses,
        }));
      case "income":
        return monthlyIncome.map((i) => ({
          ماه: i._id?.monthName,
          درآمد: i.totalIncome,
        }));
      case "contracts":
        return contractsReport.map((i) => ({
          عنوان: i.title,
          شرکت: i.companyName,
          نرخ: i.hourlyRate,
          "کل ساعت": i.totalHours,
          "تدریس شده": i.taughtHours,
          "پیشرفت تدریس": i.progressByHours,
          "مبلغ کل": i.totalAmount,
          "پرداخت شده": i.paidAmount,
          "پیشرفت مالی": i.progressByAmount,
          وضعیت: i.status,
        }));
      case "classes":
        return classesSummary
          ? [
              {
                ساعت: classesSummary.totalHours,
                کلاس: classesSummary.totalClasses,
                میانگین: classesSummary.avgHoursPerClass,
              },
            ]
          : [];
      case "range":
        const r = [];
        if (incomeRange)
          r.push({ نوع: "درآمد", مقدار: incomeRange.totalIncome });
        companiesRange.forEach((i) =>
          r.push({ نوع: i._id, ساعت: i.totalHours, کلاس: i.totalClasses }),
        );
        return r;
      default:
        return [];
    }
  };
  const getCSVHeaders = () => {
    switch (activeTab) {
      case "monthly":
        return ["کلاس", "ساعت"];
      case "companies":
        return ["شرکت", "ساعت", "کلاس"];
      case "income":
        return ["ماه", "درآمد"];
      case "contracts":
        return [
          "عنوان",
          "شرکت",
          "نرخ",
          "کل ساعت",
          "تدریس شده",
          "پیشرفت تدریس",
          "مبلغ کل",
          "پرداخت شده",
          "پیشرفت مالی",
          "وضعیت",
        ];
      case "classes":
        return ["ساعت", "کلاس", "میانگین"];
      case "range":
        return ["نوع", "مقدار"];
      default:
        return [];
    }
  };

  const SidebarFilters = () => (
    <div className="space-y-3 sm:space-y-4" style={{ position: "relative" }}>
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2 sm:pb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>فیلترها
      </h4>

      {companiesList.length > 0 && activeTab !== "contracts" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5">شرکت</label>
          <div style={{ position: "relative", zIndex: 30 }}>
            <div
              className={`dds-trigger ${companyOpen ? "open" : ""}`}
              onClick={() => setCompanyOpen(!companyOpen)}
              style={{ padding: "10px 12px", fontSize: "0.8rem" }}
            >
              <span className="text-white text-sm truncate">
                {selectedCompany
                  ? companiesList.find((c) => c.id === selectedCompany)?.name ||
                    "انتخاب"
                  : "همه شرکت‌ها"}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${companyOpen ? "rotate-180" : ""} text-purple-400 flex-shrink-0`}
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
                    className={`dds-option ${!selectedCompany ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedCompany("");
                      setCompanyOpen(false);
                      if (
                        ["monthly", "income", "companies"].includes(activeTab)
                      )
                        loadReports();
                    }}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-sm text-blue-400">
                      🏢
                    </div>
                    <span className="text-sm">همه</span>
                    {!selectedCompany && (
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
                  {companiesList.map((c) => (
                    <div
                      key={c.id}
                      className={`dds-option ${selectedCompany === c.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedCompany(c.id);
                        setCompanyOpen(false);
                        if (
                          ["monthly", "income", "companies"].includes(activeTab)
                        )
                          loadReports();
                      }}
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-sm text-emerald-400">
                        {c.name?.charAt(0)?.toUpperCase() || "؟"}
                      </div>
                      <span className="text-sm">{c.name}</span>
                      {selectedCompany === c.id && (
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
        </div>
      )}

      {/* Date Filters - هر کدوم z-index بالاتر از قبلی */}
      {activeTab === "income" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5">
            بازه درآمد
          </label>
          <div className="space-y-2">
            <div style={{ position: "relative", zIndex: 25 }}>
              <PersianDatePicker
                value={incomeStartDate}
                onChange={setIncomeStartDate}
              />
            </div>
            <div style={{ position: "relative", zIndex: 20 }}>
              <PersianDatePicker
                value={incomeEndDate}
                onChange={setIncomeEndDate}
              />
            </div>
          </div>
          <button
            onClick={loadIncomeRangeReports}
            className="w-full mt-2 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} />
            اعمال
          </button>
        </div>
      )}

      {activeTab === "monthly" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5">بازه</label>
          <div className="space-y-2">
            <div style={{ position: "relative", zIndex: 25 }}>
              <PersianDatePicker
                value={monthlyStartDate}
                onChange={setMonthlyStartDate}
              />
            </div>
            <div style={{ position: "relative", zIndex: 20 }}>
              <PersianDatePicker
                value={monthlyEndDate}
                onChange={setMonthlyEndDate}
              />
            </div>
          </div>
          <button
            onClick={loadMonthlyReport}
            className="w-full mt-2 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} />
            اعمال
          </button>
        </div>
      )}

      {activeTab === "companies" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5">بازه</label>
          <div className="space-y-2">
            <div style={{ position: "relative", zIndex: 25 }}>
              <PersianDatePicker
                value={companiesStartDate}
                onChange={setCompaniesStartDate}
              />
            </div>
            <div style={{ position: "relative", zIndex: 20 }}>
              <PersianDatePicker
                value={companiesEndDate}
                onChange={setCompaniesEndDate}
              />
            </div>
          </div>
          <button
            onClick={loadCompaniesReport}
            className="w-full mt-2 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} />
            اعمال
          </button>
        </div>
      )}

      {activeTab === "classes" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5">بازه</label>
          <div className="space-y-2">
            <div style={{ position: "relative", zIndex: 25 }}>
              <PersianDatePicker
                value={classesStartDate}
                onChange={setClassesStartDate}
              />
            </div>
            <div style={{ position: "relative", zIndex: 20 }}>
              <PersianDatePicker
                value={classesEndDate}
                onChange={setClassesEndDate}
              />
            </div>
          </div>
          <button
            onClick={loadClassesReport}
            className="w-full mt-2 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} />
            اعمال
          </button>
        </div>
      )}

      {activeTab === "range" && (
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5">بازه</label>
          <div className="space-y-2">
            <div style={{ position: "relative", zIndex: 25 }}>
              <PersianDatePicker value={startDate} onChange={setStartDate} />
            </div>
            <div style={{ position: "relative", zIndex: 20 }}>
              <PersianDatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>
          <button
            onClick={loadRangeReports}
            className="w-full mt-2 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} />
            اعمال
          </button>
        </div>
      )}
    </div>
  );

  const DateFilter = ({
    label,
    start,
    setStart,
    end,
    setEnd,
    onApply,
    color,
  }) => (
    <div>
      <label className="block text-[10px] text-gray-500 mb-1.5">{label}</label>
      <div className="space-y-2">
        <div style={{ position: "relative", zIndex: 10 }}>
          <PersianDatePicker value={start} onChange={setStart} />
        </div>
        <div style={{ position: "relative", zIndex: 10 }}>
          <PersianDatePicker value={end} onChange={setEnd} />
        </div>
      </div>
      <button
        onClick={onApply}
        className={`w-full mt-2 py-2 rounded-lg bg-${color}-600/20 hover:bg-${color}-600/30 text-${color}-400 text-xs font-medium flex items-center justify-center gap-1.5`}
      >
        <RefreshCw size={12} />
        اعمال
      </button>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen" dir="rtl">
      <style>{`
        @keyframes ddsSlide { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease; }
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 12px; padding: 10px 14px; font-size: .8rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 12px 16px; font-size: .85rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 3px rgba(139,92,246,0.08); }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .tab-btn { padding: 8px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 500; transition: all 0.2s; cursor: pointer; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); color: #94a3b8; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        @media (min-width: 640px) { .tab-btn { padding: 10px 18px; border-radius: 12px; font-size: 0.82rem; gap: 7px; } }
        .tab-btn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; border-color: rgba(255,255,255,0.08); }
        .tab-btn.active { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-color: transparent; box-shadow: 0 4px 15px rgba(139,92,246,0.3); }
        .dds-trigger { background: rgba(17,24,39,0.9); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; text-align: right; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .dds-trigger:hover { border-color: rgba(139,92,246,0.3); }
        .dds-trigger.open { border-color: rgba(139,92,246,0.5); border-radius: 12px 12px 0 0; }
        .dds-options { position: absolute; top: 100%; left: 0; right: 0; background: rgba(17,24,39,0.98); border: 1px solid rgba(139,92,246,0.2); border-top: none; border-radius: 0 0 12px 12px; z-index: 20; max-height: 200px; overflow-y: auto; animation: ddsSlide 0.15s; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .dds-option { padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.02); color: #cbd5e1; font-size: 0.8rem; }
        @media (min-width: 640px) { .dds-option { padding: 11px 16px; font-size: 0.85rem; } }
        .dds-option:hover { background: rgba(139,92,246,0.08); color: #fff; }
        .dds-option.selected { background: rgba(139,92,246,0.12); color: #fff; font-weight: 600; }
        .dds-overlay { position: fixed; inset: 0; z-index: 15; }
        .filter-toggle { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); color: #a78bfa; font-size: 0.8rem; cursor: pointer; }
        @media (min-width: 1024px) { .filter-toggle { display: none; } }
        
        /* عدد داخل کارت - word break */
        .stat-value { word-break: break-all; overflow-wrap: break-word; hyphens: auto; }
        // توی PersianDatePicker.jsx
// تقویم dropdown:
style={{ 
  position: 'fixed', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)',
  zIndex: 9999,
  }}
      `}</style>

      <div className="mb-6 sm:mb-8 text-right">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          گزارشات
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          تحلیل و بررسی آمار تدریس و درآمد
        </p>
      </div>

      {/* Tabs + Download */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
        <div className="relative mr-auto flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="filter-toggle lg:hidden"
          >
            <span>فیلترها</span>
          </button>
          <div ref={downloadMenuRef}>
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="tab-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
            >
              <Download size={14} />
              <span className="hidden sm:inline">خروجی</span>
            </button>
            {showDownloadMenu && (
              <div className="absolute left-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    printReport("report-content", `گزارش-${activeTab}`);
                    setShowDownloadMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-right text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileText size={14} />
                  PDF
                </button>
                <button
                  onClick={() => {
                    generateExcel(
                      getCSVData(),
                      getCSVHeaders(),
                      activeTab,
                      `گزارش-${activeTab}.xlsx`,
                    );
                    setShowDownloadMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-right text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 border-t border-gray-700"
                >
                  <FileText size={14} />
                  Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="glass-card p-3 sm:p-4 sticky top-20">
            <SidebarFilters />
          </div>
        </div>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 p-4 overflow-y-auto overflow-x-hidden shadow-2xl animate-slide-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">فیلترها</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarFilters />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0" id="report-content">
          {loading ? (
            <div className="flex justify-center py-16 sm:py-20">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === "monthly" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="glass-card p-4 sm:p-5 text-center overflow-hidden">
                      <div className="text-lg sm:text-2xl font-extrabold text-blue-400 stat-value">
                        {monthlyTeaching?.totalClasses || 0}
                      </div>
                      <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                        کلاس‌ها
                      </div>
                    </div>
                    <div className="glass-card p-4 sm:p-5 text-center overflow-hidden">
                      <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 stat-value">
                        {monthlyTeaching?.totalHours || 0}
                      </div>
                      <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                        ساعت تدریس
                      </div>
                    </div>
                  </div>
                  {renderLineChart(teachingChart, "روند ساعات تدریس")}
                </div>
              )}
              {activeTab === "companies" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="glass-card p-4 sm:p-5">
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <Building2 size={16} className="text-purple-400" />
                      آموزش بر اساس شرکت
                    </h3>
                    {companyTeaching.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6">
                        داده‌ای نیست
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {companyTeaching.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-white/[0.02] text-xs sm:text-sm"
                          >
                            <div className="flex gap-2 sm:gap-3">
                              <span className="text-emerald-400">
                                {item.totalHours}ساعت
                              </span>
                              <span className="text-blue-400">
                                {item.totalClasses}کلاس
                              </span>
                            </div>
                            <span className="text-white truncate ml-2">
                              {item._id}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {renderPieChart(companyChart)}
                </div>
              )}
              {activeTab === "income" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="glass-card p-4 sm:p-5 text-center overflow-hidden">
                    <h3 className="font-bold text-sm mb-3 flex items-center justify-center gap-2">
                      <DollarSign size={16} className="text-emerald-400" />
                      درآمد
                    </h3>
                    {incomeRange ? (
                      <>
                        <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 stat-value">
                          {formatMoney(incomeRange?.totalIncome)}{" "}
                          <span className="text-sm text-gray-500">تومان</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {incomeRange?.count || 0} تراکنش
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm py-6">
                        بازه را انتخاب کنید
                      </p>
                    )}
                  </div>
                  {renderBarChart(incomeChart, "نمودار درآمد")}
                </div>
              )}
              {activeTab === "contracts" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="glass-card p-4 sm:p-5">
                    <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                      <FileText size={16} className="text-purple-400" />
                      لیست قراردادها
                    </h3>
                    {contractsReport.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6">
                        قراردادی نیست
                      </p>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {contractsReport.map((c, i) => (
                          <div
                            key={i}
                            className="bg-white/[0.02] rounded-xl p-3 sm:p-4"
                          >
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                              <div className="min-w-0 flex-1 ml-2">
                                <h4 className="font-bold text-white text-sm truncate">
                                  {c.title}
                                </h4>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                                  {c.companyName}
                                </p>
                              </div>
                              <span
                                className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${c.status === "active" ? "bg-emerald-500/10 text-emerald-400" : c.status === "finished" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}
                              >
                                {c.status === "active"
                                  ? "فعال"
                                  : c.status === "finished"
                                    ? "پایان"
                                    : "لغو"}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs mb-2 sm:mb-3">
                              <div>
                                <span className="text-gray-500">نرخ</span>
                                <p className="text-amber-400 font-bold break-all">
                                  {formatMoney(c.hourlyRate)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">کل ساعت</span>
                                <p className="text-white">{c.totalHours}</p>
                              </div>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div>
                                <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mb-1">
                                  <span>تدریس: {c.taughtHours}ساعت</span>
                                  <span>{c.progressByHours}%</span>
                                </div>
                                <div className="h-1 sm:h-1.5 bg-gray-700 rounded-full">
                                  <div
                                    className="h-1 sm:h-1.5 bg-blue-500 rounded-full"
                                    style={{ width: `${c.progressByHours}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mb-1">
                                  <span>
                                    پرداخت: {formatMoney(c.paidAmount)}
                                  </span>
                                  <span>{c.progressByAmount}%</span>
                                </div>
                                <div className="h-1 sm:h-1.5 bg-gray-700 rounded-full">
                                  <div
                                    className="h-1 sm:h-1.5 bg-emerald-500 rounded-full"
                                    style={{ width: `${c.progressByAmount}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "classes" && (
                <div className="space-y-3 sm:space-y-4">
                  {classesSummary && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        {
                          l: "کل ساعت",
                          v: classesSummary.totalHours,
                          c: "text-blue-400",
                        },
                        {
                          l: "کل کلاس",
                          v: classesSummary.totalClasses,
                          c: "text-emerald-400",
                        },
                        {
                          l: "میانگین",
                          v: classesSummary.avgHoursPerClass,
                          c: "text-purple-400",
                        },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className="glass-card p-3 sm:p-4 text-center overflow-hidden"
                        >
                          <div
                            className={`text-lg sm:text-2xl font-extrabold ${s.c} stat-value`}
                          >
                            {s.v}
                          </div>
                          <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                            {s.l}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {renderBarChart(classesChart, "گزارش کلاس‌ها")}
                </div>
              )}
              {activeTab === "range" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="glass-card p-3 sm:p-4 overflow-hidden">
                      <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 stat-value">
                        {formatMoney(incomeRange?.totalIncome)}{" "}
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          تومان
                        </span>
                      </div>
                      <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                        درآمد
                      </div>
                    </div>
                    <div className="glass-card p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-extrabold text-purple-400">
                        {companiesRange.length}
                      </div>
                      <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                        شرکت
                      </div>
                    </div>
                  </div>
                  {renderLineChart(rangeChart, "نمودار درآمد")}
                  {companiesRange.length > 0 && (
                    <div className="glass-card p-4 sm:p-5">
                      <h4 className="font-bold text-sm mb-3">جزئیات</h4>
                      <div className="space-y-1.5">
                        {companiesRange.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-white/[0.02] text-xs sm:text-sm"
                          >
                            <div className="flex gap-2 sm:gap-3">
                              <span className="text-emerald-400">
                                {item.totalHours}ساعت
                              </span>
                              <span className="text-blue-400">
                                {item.totalClasses}کلاس
                              </span>
                            </div>
                            <span className="text-white truncate ml-2">
                              {item._id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
