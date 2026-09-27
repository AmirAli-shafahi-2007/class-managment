import { useEffect, useState } from "react";
import classLogService from "../../services/classLogService";
import classTemplateService from "../../services/classTemplateService";
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  X, 
  AlertCircle, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";
import PersianDatePicker from "../../components/PersianDatePicker";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

export default function DailyClassLogPage() {
  const [logs, setLogs] = useState([]);
  const [classTemplates, setClassTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    classTemplate: "",
    date: moment().format("jYYYY-jMM-jDD"),
    attended: true,
    hoursTaught: 0,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  // تبدیل تاریخ شمسی به میلادی برای API
  const convertToGregorian = (jalaliDate) => {
    if (!jalaliDate) return null;
    const m = moment(jalaliDate, "jYYYY-jMM-jDD");
    if (!m.isValid()) return null;
    return m.format("YYYY-MM-DD");
  };

  async function loadData() {
    setLoading(true);
    try {
      const [logsRes, classesRes] = await Promise.all([
        classLogService.getAll(),
        classTemplateService.getAll(),
      ]);
      setLogs(logsRes?.data || []);
      setClassTemplates(classesRes?.data || []);
    } catch (err) {
      console.error("خطا:", err);
    }
    setLoading(false);
  }

  const openCreateModal = () => {
    setForm({ 
      classTemplate: "", 
      date: moment().format("jYYYY-jMM-jDD"), 
      attended: true, 
      hoursTaught: 1.5, 
      notes: "" 
    });
    setEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (log) => {
    // تبدیل تاریخ میلادی به شمسی
    let jalaliDate = moment().format("jYYYY-jMM-jDD");
    if (log.date) {
      const m = moment(log.date);
      if (m.isValid()) {
        jalaliDate = m.format("jYYYY-jMM-jDD");
      }
    }
    
    setForm({
      classTemplate: log.classTemplate?._id || log.classTemplate || "",
      date: jalaliDate,
      attended: log.attended ?? true,
      hoursTaught: log.hoursTaught || 0,
      notes: log.notes || "",
    });
    setSelectedLog(log);
    setEditMode(true);
    setModalOpen(true);
  };

  const openDetailModal = (log) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.classTemplate || !form.date) {
      alert("لطفاً کلاس و تاریخ را انتخاب کنید");
      return;
    }
    try {
      // تبدیل تاریخ شمسی به میلادی برای ذخیره در دیتابیس
      const gregorianDate = convertToGregorian(form.date);
      const payload = {
        ...form,
        date: gregorianDate,
        hoursTaught: form.attended ? (form.hoursTaught || 0) : 0
      };
      
      if (editMode) {
        await classLogService.update(selectedLog._id, payload);
      } else {
        await classLogService.create(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error("خطا:", err);
      alert("خطایی رخ داد");
    }
  }

  async function handleDelete(id) {
    try {
      await classLogService.remove(id);
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      console.error("خطا:", err);
    }
  }

  // تبدیل تاریخ میلادی به شمسی برای نمایش
  const formatDateToPersian = (date) => {
    if (!date) return "-";
    const m = moment(date);
    if (!m.isValid()) return "-";
    return m.format("jYYYY-jMM-jDD");
  };

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.classTemplate?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.classTemplate?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAttendance = attendanceFilter === "all" || (attendanceFilter === "attended" && log.attended) || (attendanceFilter === "absent" && !log.attended);
      return matchesSearch && matchesAttendance;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest": return new Date(a.date) - new Date(b.date);
        case "hours_high": return (b.hoursTaught || 0) - (a.hoursTaught || 0);
        case "hours_low": return (a.hoursTaught || 0) - (b.hoursTaught || 0);
        case "newest": default: return new Date(b.date) - new Date(a.date);
      }
    });

  const totalLogs = logs.length;
  const attendedLogs = logs.filter((l) => l.attended).length;
  const absentLogs = logs.filter((l) => !l.attended).length;
  const totalHours = logs.reduce((sum, l) => sum + (l.hoursTaught || 0), 0);

  return (
    <div className="p-6 text-white min-h-screen" dir="rtl">
      <style>{`
        .glass-input {
          background-color: rgba(17,24,39,0.9) !important;
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          border-radius: 12px;
          padding: 12px 16px;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          text-align: right;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.4); }
        .glass-input:focus {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
          border-color: rgba(59,130,246,0.6);
          background-color: rgba(30,41,59,0.95) !important;
        }
        .glass-input:hover { border-color: rgba(255,255,255,0.2); background-color: rgba(30,41,59,0.8) !important; }

        select.glass-input {
          -webkit-appearance: none; -moz-appearance: none; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 20 20' fill='%239CA3AF' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: left 14px center; background-size: 16px 16px;
          padding-left: 40px; padding-right: 16px; min-height: 48px; cursor: pointer;
        }
        select.glass-input option { background-color: #1e293b; color: #e2e8f0; padding: 12px 16px; }
        select.glass-input option:hover, select.glass-input option:checked {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important; color: white !important;
        }

        input[type="number"].glass-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.7; cursor: pointer; }
        input[type="number"].glass-input { -moz-appearance: textfield; }
        input[type="number"].glass-input::-webkit-outer-spin-button,
        input[type="number"].glass-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06)); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(20px); }
        .stat-card { background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .icon-circle { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        .log-card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; transition: all 0.3s ease; }
        .log-card:hover { background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05)); border-color: rgba(255,255,255,0.15); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .log-card.absent { border-right: 4px solid rgba(239,68,68,0.5); }
        .log-card.attended { border-right: 4px solid rgba(34,197,94,0.5); }

        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-animate { animation: modalFadeIn 0.3s ease-out; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pulse-animation { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .detail-row:last-child { border-bottom: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-right">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">گزارش کلاس‌های روزانه</h1>
          <p className="text-gray-400 text-sm">ثبت و پیگیری حضور و غیاب و ساعات تدریس</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 hover:scale-105 active:scale-95">
          <Plus size={20} />
          <span>ثبت گزارش جدید</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "کل گزارش‌ها", value: totalLogs, color: "text-blue-400", bg: "bg-blue-500/20", Icon: ClipboardList },
          { label: "حاضر", value: attendedLogs, color: "text-green-400", bg: "bg-green-500/20", Icon: CheckCircle },
          { label: "غایب", value: absentLogs, color: "text-red-400", bg: "bg-red-500/20", Icon: XCircle },
          { label: "ساعت تدریس", value: totalHours.toFixed(1), color: "text-purple-400", bg: "bg-purple-500/20", Icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
              <div className={`icon-circle ${stat.bg}`}>
                <stat.Icon size={20} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="جستجو در عنوان کلاس، شرکت..." className="glass-input w-full pl-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"><X size={16} /></button>
            )}
          </div>
          <select className="glass-input min-w-[150px] cursor-pointer" value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value)}>
            <option value="all">همه وضعیت‌ها</option>
            <option value="attended">حاضر</option>
            <option value="absent">غایب</option>
          </select>
          <select className="glass-input min-w-[180px] cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="hours_high">بیشترین ساعت</option>
            <option value="hours_low">کمترین ساعت</option>
          </select>
          {(searchTerm || attendanceFilter !== "all" || sortBy !== "newest") && (
            <button onClick={() => { setSearchTerm(""); setAttendanceFilter("all"); setSortBy("newest"); }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap">
              <X size={16} /><span>حذف فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 pulse-animation">در حال بارگذاری...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <ClipboardList size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-lg">{searchTerm || attendanceFilter !== "all" ? "گزارشی با این مشخصات یافت نشد" : "هیچ گزارشی ثبت نشده است"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLogs.map((log) => (
            <div key={log._id} className={`log-card ${log.attended ? "attended" : "absent"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className={`icon-circle ${log.attended ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    {log.attended ? <CheckCircle size={20} className="text-green-400" /> : <XCircle size={20} className="text-red-400" />}
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-white truncate">{log.classTemplate?.title || "بدون عنوان"}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-lg border mt-1 inline-block ${log.attended ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {log.attended ? "حاضر" : "غایب"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm flex-row-reverse justify-end">
                  <span className="text-gray-300">{formatDateToPersian(log.date)}</span>
                  <Calendar size={14} className="text-blue-400 flex-shrink-0" />
                </div>
                {log.classTemplate?.company && (
                  <div className="flex items-center gap-2 text-sm flex-row-reverse justify-end">
                    <span className="text-gray-300">{log.classTemplate.company.name}</span>
                    <Building2 size={14} className="text-green-400 flex-shrink-0" />
                  </div>
                )}
                {log.attended && (
                  <div className="flex items-center gap-2 text-sm flex-row-reverse justify-end">
                    <span className="text-gray-300">{log.hoursTaught || 0} ساعت تدریس</span>
                    <Clock size={14} className="text-yellow-400 flex-shrink-0" />
                  </div>
                )}
              </div>

              {log.notes && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 line-clamp-2 text-right">{log.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-white/10">
                <button onClick={() => openDetailModal(log)} className="flex-1 px-3 py-2 rounded-lg bg-emerald-600/60 hover:bg-emerald-600 transition text-sm flex items-center justify-center gap-1">
                  <Info size={14} /><span>جزئیات</span>
                </button>
                <button onClick={() => openEditModal(log)} className="px-3 py-2 rounded-lg bg-blue-600/60 hover:bg-blue-600 transition text-sm"><Edit3 size={14} /></button>
                <button onClick={() => setDeleteConfirm(log._id)} className="px-3 py-2 rounded-lg bg-red-600/60 hover:bg-red-600 transition text-sm"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto modal-animate scrollbar-thin" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <div className="text-right">
                <h2 className="text-2xl font-bold">{editMode ? "ویرایش گزارش" : "ثبت گزارش جدید"}</h2>
                <p className="text-gray-400 text-sm mt-1">اطلاعات کلاس برگزار شده را ثبت کنید</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg bg-gray-700/60 hover:bg-gray-700 transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2 text-right">کلاس *</label>
                <select className="glass-input w-full" value={form.classTemplate} onChange={(e) => setForm({ ...form, classTemplate: e.target.value })} required>
                  <option value="">انتخاب کلاس</option>
                  {classTemplates.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.title} - {cls.company?.name || "بدون شرکت"}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 text-right">تاریخ برگزاری (شمسی) *</label>
                <PersianDatePicker 
                  value={form.date} 
                  onChange={(date) => setForm({ ...form, date: date })}
                  placeholder="انتخاب تاریخ"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 text-right">وضعیت حضور</label>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setForm({ ...form, attended: true, hoursTaught: form.hoursTaught || 1.5 })} 
                    className={`flex-1 py-3 rounded-xl font-semibold transition border ${form.attended ? "bg-green-500/20 border-green-500/50 text-green-400" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                  >
                    ✅ حاضر
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setForm({ ...form, attended: false, hoursTaught: 0 })} 
                    className={`flex-1 py-3 rounded-xl font-semibold transition border ${!form.attended ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                  >
                    ❌ غایب
                  </button>
                </div>
              </div>
              
              {form.attended && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2 text-right">ساعت تدریس</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0" 
                    max="24" 
                    className="glass-input w-full" 
                    value={form.hoursTaught} 
                    onChange={(e) => setForm({ ...form, hoursTaught: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 text-right">یادداشت</label>
                <textarea 
                  className="glass-input w-full min-h-[100px] resize-y" 
                  placeholder="توضیحات تکمیلی..." 
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  rows={3} 
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95">
                  {editMode ? "ذخیره تغییرات" : "ثبت گزارش"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-700/70 hover:bg-gray-700 rounded-xl transition">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto modal-animate scrollbar-thin" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">جزئیات گزارش</h2>
              <button onClick={() => setDetailModalOpen(false)} className="p-2 rounded-lg bg-gray-700/60 hover:bg-gray-700 transition"><X size={20} /></button>
            </div>
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white ${selectedLog.attended ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}>
                {selectedLog.attended ? <CheckCircle size={36} /> : <XCircle size={36} />}
              </div>
              <h3 className="text-xl font-bold mb-2">{selectedLog.classTemplate?.title || "بدون عنوان"}</h3>
              <span className={`text-sm px-4 py-1.5 rounded-lg border ${selectedLog.attended ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                {selectedLog.attended ? "حاضر" : "غایب"}
              </span>
            </div>
            <div className="space-y-0">
              <div className="detail-row">
                <span className="text-white">{formatDateToPersian(selectedLog.date)}</span>
                <span className="text-gray-400 text-sm">تاریخ برگزاری</span>
              </div>
              {selectedLog.classTemplate?.company && (
                <div className="detail-row">
                  <span className="text-white">{selectedLog.classTemplate.company.name}</span>
                  <span className="text-gray-400 text-sm">شرکت</span>
                </div>
              )}
              {selectedLog.attended && (
                <div className="detail-row">
                  <span className="text-white text-lg font-bold">{selectedLog.hoursTaught || 0} ساعت</span>
                  <span className="text-gray-400 text-sm">ساعت تدریس</span>
                </div>
              )}
              {selectedLog.notes && (
                <div className="detail-row flex-col items-start gap-2">
                  <span className="text-gray-400 text-sm">یادداشت</span>
                  <p className="text-white/80 text-sm bg-white/5 rounded-xl p-3 w-full text-right">{selectedLog.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setDetailModalOpen(false); openEditModal(selectedLog); }} className="flex-1 py-3 bg-blue-600/70 hover:bg-blue-600 rounded-xl font-semibold transition">
                ویرایش
              </button>
              <button onClick={() => setDetailModalOpen(false)} className="flex-1 py-3 bg-gray-700/70 hover:bg-gray-700 rounded-xl transition">
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-2xl w-full max-w-[400px] modal-animate" dir="rtl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">تأیید حذف</h3>
              <p className="text-gray-400">آیا از حذف این گزارش اطمینان دارید؟</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition">
                بله، حذف کن
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-700/70 hover:bg-gray-700 rounded-xl transition">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}