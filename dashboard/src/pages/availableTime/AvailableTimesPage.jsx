import { useEffect, useState } from "react";
import availableTimeService from "../../services/availableTimeService";
import { Clock, Plus, Trash2, Edit3, Info, X, AlertCircle, Calendar } from "lucide-react";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const dayLabels = {
  saturday: "شنبه", sunday: "یکشنبه", monday: "دوشنبه", tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه", thursday: "پنجشنبه", friday: "جمعه",
};

const dayColors = {
  saturday: "border-blue-500/30 bg-blue-500/5", sunday: "border-green-500/30 bg-green-500/5",
  monday: "border-purple-500/30 bg-purple-500/5", tuesday: "border-orange-500/30 bg-orange-500/5",
  wednesday: "border-pink-500/30 bg-pink-500/5", thursday: "border-yellow-500/30 bg-yellow-500/5",
  friday: "border-red-500/30 bg-red-500/5",
};

const dayBadgeColors = {
  saturday: "bg-blue-500/10 text-blue-400 border-blue-500/20", sunday: "bg-green-500/10 text-green-400 border-green-500/20",
  monday: "bg-purple-500/10 text-purple-400 border-purple-500/20", tuesday: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  wednesday: "bg-pink-500/10 text-pink-400 border-pink-500/20", thursday: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  friday: "bg-red-500/10 text-red-400 border-red-500/20",
};

const DAYS_ORDER = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];

export default function AvailableTimesPage() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayFilter, setDayFilter] = useState("all");
  const [sortBy, setSortBy] = useState("day");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ dayOfWeek: "saturday", startTime: "", endTime: "" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try { const res = await availableTimeService.getAll(); setTimeSlots(res?.data || []); }
    catch (err) { console.error("خطا:", err); }
    setLoading(false);
  }

  const openCreateModal = () => { setForm({ dayOfWeek: "saturday", startTime: "", endTime: "" }); setEditMode(false); setModalOpen(true); };
  const openEditModal = (slot) => { setForm({ dayOfWeek: slot.dayOfWeek || "saturday", startTime: slot.startTime || "", endTime: slot.endTime || "" }); setSelectedSlot(slot); setEditMode(true); setModalOpen(true); };
  const openDetailModal = (slot) => { setSelectedSlot(slot); setDetailModalOpen(true); };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.startTime || !form.endTime) { alert("لطفاً ساعت شروع و پایان را وارد کنید"); return; }
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = { ...form, teacher: user._id };
      if (editMode) { await availableTimeService.update(selectedSlot._id, payload); }
      else { await availableTimeService.create(payload); }
      setModalOpen(false); loadData();
    } catch (err) { console.error("خطا:", err); alert("خطایی رخ داد"); }
  }

  async function handleDelete(id) { try { await availableTimeService.remove(id); setDeleteConfirm(null); loadData(); } catch (err) { console.error("خطا:", err); } }

  // تبدیل تاریخ میلادی به شمسی برای نمایش
  const formatDateToPersian = (date) => {
    if (!date) return "-";
    const m = moment(date);
    if (!m.isValid()) return "-";
    return m.format("jYYYY-jMM-jDD");
  };

  const filteredSlots = timeSlots
    .filter((slot) => dayFilter === "all" || slot.dayOfWeek === dayFilter)
    .sort((a, b) => {
      switch (sortBy) { 
        case "time": return (a.startTime || "").localeCompare(b.startTime || ""); 
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt); 
        default: return DAYS_ORDER.indexOf(a.dayOfWeek) - DAYS_ORDER.indexOf(b.dayOfWeek); 
      }
    });

  const groupedByDay = DAYS_ORDER.map((day) => ({ 
    day, 
    label: dayLabels[day], 
    slots: filteredSlots.filter((s) => s.dayOfWeek === day) 
  })).filter((g) => g.slots.length > 0 || dayFilter !== "all");
  
  const formatDate = (d) => d ? formatDateToPersian(d) : "-";

  return (
    <div className="p-6 text-white min-h-screen" dir="rtl">
      <style>{`
        .glass-input { background-color: rgba(17,24,39,0.9)!important; border: 1px solid rgba(255,255,255,0.12); color: #fff; border-radius: 12px; padding: 12px 16px; font-size: .95rem; transition: all .3s; text-align: right; width: 100%; }
        .glass-input:focus { box-shadow: 0 0 0 3px rgba(59,130,246,0.2); border-color: rgba(59,130,246,0.6); }
        select.glass-input { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 20 20' fill='%239CA3AF' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 14px center; background-size: 16px 16px; padding-left: 40px; padding-right: 16px; min-height: 48px; cursor: pointer; }
        select.glass-input option { background-color: #1e293b; color: #e2e8f0; }
        input[type="time"].glass-input::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.06)); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(20px); }
        .stat-card { background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; }
        .icon-circle { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .time-slot-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; transition: all .3s; background: rgba(255,255,255,0.03); }
        .time-slot-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }
        .day-section { border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; }
        @keyframes modalFadeIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-animate { animation: modalFadeIn .3s ease-out; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .detail-row:last-child { border-bottom: none; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-right">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">زمان‌های در دسترس</h1>
          <p className="text-gray-400 text-sm">مدیریت زمان‌های آزاد برای تدریس</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
          <Plus size={20} /><span>افزودن زمان جدید</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "کل زمان‌ها", value: timeSlots.length, icon: "⏰", bg: "bg-blue-500/20" },
          { label: "روزهای فعال", value: [...new Set(timeSlots.map(s => s.dayOfWeek))].length, icon: "📅", bg: "bg-purple-500/20" },
          { label: "روزهای هفته", value: DAYS_ORDER.length, icon: "✅", bg: "bg-green-500/20" },
        ].map((s, i) => (
          <div key={i} className="stat-card text-right">
            <div className="flex items-center justify-between">
              <div><div className="text-2xl font-bold">{s.value}</div><div className="text-gray-400 text-sm">{s.label}</div></div>
              <div className={`icon-circle ${s.bg}`}><span className="text-xl">{s.icon}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="mb-6"><div className="flex flex-col lg:flex-row gap-3">
        <select className="glass-input min-w-[160px] cursor-pointer" value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
          <option value="all">همه روزها</option>
          {DAYS_ORDER.map((day) => <option key={day} value={day}>{dayLabels[day]}</option>)}
        </select>
        <select className="glass-input min-w-[160px] cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="day">بر اساس روز</option><option value="time">بر اساس ساعت</option><option value="newest">جدیدترین</option>
        </select>
        {(dayFilter !== "all" || sortBy !== "day") && (
          <button onClick={() => { setDayFilter("all"); setSortBy("day"); }} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl flex items-center gap-2 text-sm">
            <X size={16} /><span>حذف فیلترها</span>
          </button>
        )}
      </div></div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-gray-400">در حال بارگذاری...</p></div>
      ) : filteredSlots.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center"><Clock size={48} className="text-gray-600 mx-auto mb-4 opacity-50" /><p className="text-gray-400 text-lg">{dayFilter !== "all" ? "زمانی برای این روز ثبت نشده" : "هیچ زمانی ثبت نشده"}</p></div>
      ) : dayFilter === "all" ? (
        <div className="space-y-4">
          {groupedByDay.map((group) => (
            <div key={group.day} className="day-section">
              <div className={`flex items-center justify-between p-4 ${dayColors[group.day]}`}>
                <span className="text-sm text-gray-400">{group.slots.length} زمان</span>
                <h3 className="text-lg font-bold flex items-center gap-2 flex-row-reverse">
                  <span className={`text-xs px-3 py-1 rounded-lg border ${dayBadgeColors[group.day]}`}>{group.label}</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {group.slots.map((slot) => (
                    <div key={slot._id} className="time-slot-card flex items-center justify-between">
                      <div className="flex gap-1">
                        <button onClick={() => openDetailModal(slot)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Info size={14} /></button>
                        <button onClick={() => openEditModal(slot)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400"><Edit3 size={14} /></button>
                        <button onClick={() => setDeleteConfirm(slot._id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <span className="text-white font-medium">{slot.startTime} - {slot.endTime}</span>
                        <Clock size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredSlots.map((slot) => (
            <div key={slot._id} className={`time-slot-card flex items-center justify-between ${dayColors[slot.dayOfWeek]}`}>
              <div className="flex gap-1">
                <button onClick={() => openDetailModal(slot)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Info size={14} /></button>
                <button onClick={() => openEditModal(slot)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400"><Edit3 size={14} /></button>
                <button onClick={() => setDeleteConfirm(slot._id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
              <div className="flex items-center gap-3 flex-row-reverse">
                <span className="text-white font-medium">{slot.startTime} - {slot.endTime}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg border ${dayBadgeColors[slot.dayOfWeek]}`}>{dayLabels[slot.dayOfWeek]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto modal-animate" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">جزئیات زمان</h2>
              <button onClick={() => setDetailModalOpen(false)} className="p-2 rounded-lg bg-gray-700/60 hover:bg-gray-700">✕</button>
            </div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <Clock size={36} />
              </div>
              <h3 className="text-xl font-bold mb-2">{dayLabels[selectedSlot.dayOfWeek]}</h3>
              <span className="text-sm px-4 py-1.5 rounded-lg border bg-blue-500/10 text-blue-400 border-blue-500/20">
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </span>
            </div>
            <div className="space-y-0">
              <div className="detail-row">
                <span className="text-white">{dayLabels[selectedSlot.dayOfWeek]}</span>
                <span className="text-gray-400 text-sm">روز هفته</span>
              </div>
              <div className="detail-row">
                <span className="text-white">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                <span className="text-gray-400 text-sm">ساعت</span>
              </div>
              {selectedSlot.createdAt && (
                <div className="detail-row">
                  <span className="text-white">{formatDate(selectedSlot.createdAt)}</span>
                  <span className="text-gray-400 text-sm">تاریخ ثبت</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setDetailModalOpen(false); openEditModal(selectedSlot); }} className="flex-1 py-3 bg-blue-600/70 hover:bg-blue-600 rounded-xl font-semibold transition">
                ویرایش
              </button>
              <button onClick={() => setDetailModalOpen(false)} className="flex-1 py-3 bg-gray-700/70 hover:bg-gray-700 rounded-xl transition">
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto modal-animate" dir="rtl">
            <div className="flex items-center justify-between mb-6"><div className="text-right"><h2 className="text-2xl font-bold">{editMode ? "ویرایش" : "افزودن"} زمان</h2></div><button onClick={() => setModalOpen(false)} className="p-2 rounded-lg bg-gray-700/60 hover:bg-gray-700">✕</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2 text-right">روز</label><select className="glass-input w-full" value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}>{DAYS_ORDER.map((day) => <option key={day} value={day}>{dayLabels[day]}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-2 text-right">ساعت شروع</label><input type="time" className="glass-input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required /></div>
                <div><label className="block text-sm text-gray-400 mb-2 text-right">ساعت پایان</label><input type="time" className="glass-input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl font-semibold">{editMode ? "ذخیره" : "افزودن"}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-700/70 rounded-xl">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-2xl w-full max-w-[400px] modal-animate text-center" dir="rtl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center"><span className="text-red-400 text-3xl">⚠️</span></div>
            <h3 className="text-xl font-bold mb-2">تأیید حذف</h3><p className="text-gray-400 mb-6">آیا از حذف این زمان اطمینان دارید؟</p>
            <div className="flex gap-3"><button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold">بله</button><button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-700/70 rounded-xl">انصراف</button></div>
          </div>
        </div>
      )}
    </div>
  );
}