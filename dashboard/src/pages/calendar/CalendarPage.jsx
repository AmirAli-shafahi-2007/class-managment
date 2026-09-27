import { useEffect, useState } from "react";
import generatedClassService from "../../services/generatedClassService";
import { Calendar, Clock, ChevronRight, ChevronLeft, CheckCircle, X, Save } from "lucide-react";
import moment from "moment-jalaali";
import { toast } from "../../components/Toast";

moment.loadPersian({ dialect: "persian-modern" });

const statusColors = { pending: "bg-amber-500/10 text-amber-400 border-amber-500/20", attended: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", absent: "bg-red-500/10 text-red-400 border-red-500/20", cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
const statusText = { pending: "در انتظار", attended: "حاضر", absent: "غایب", cancelled: "لغو شده" };

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment().format("jYYYY-jMM-jDD"));
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(moment().jYear());
  const [attendanceForm, setAttendanceForm] = useState({ attended: true, hoursTaught: 0, notes: "" });
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadClasses = async (jd) => { setLoading(true); try { const m = moment(jd, "jYYYY-jMM-jDD"); const r = await generatedClassService.getByDate(m.format("YYYY-MM-DD")); setClasses(r?.data||[]); } catch(e) { console.error(e); } setLoading(false); };
  const loadStats = async (jd) => { try { const s = moment(jd,"jYYYY-jMM-jDD").startOf("jMonth").format("YYYY-MM-DD"); const e = moment(jd,"jYYYY-jMM-jDD").endOf("jMonth").format("YYYY-MM-DD"); const r = await generatedClassService.getStats(s,e); setStats(r?.data?.summary||null); } catch(e) { console.error(e); } };

  useEffect(() => { setPickerYear(moment(selectedDate,"jYYYY-jMM-jDD").jYear()); loadClasses(selectedDate); loadStats(selectedDate); }, [selectedDate]);

  const openAttendanceModal = (c) => { setSelectedClass(c); setAttendanceForm({ attended: c.attended||false, hoursTaught: c.hoursTaught||calcHours(c.startTime,c.endTime), notes: c.notes||"" }); setAttendanceModal(true); };
  const calcHours = (s,e) => { if(!s||!e) return 0; const [sh,sm]=s.split(":").map(Number); const [eh,em]=e.split(":").map(Number); let h=eh-sh,m=em-sm; if(m<0){h--;m+=60;} return h+m/60; };

  const handleSubmitAttendance = async () => { if(!selectedClass)return; try { await generatedClassService.markAttendance(selectedClass._id,attendanceForm.attended,attendanceForm.hoursTaught,attendanceForm.notes); toast.success("ثبت شد ✨"); setAttendanceModal(false); loadClasses(selectedDate); loadStats(selectedDate); } catch(e) { toast.error("خطا"); } };
  const changeDate = (d) => { setSelectedDate(moment(selectedDate,"jYYYY-jMM-jDD").add(d,"days").format("jYYYY-jMM-jDD")); };
  const changeMonth = (d) => { setSelectedDate(moment(selectedDate,"jYYYY-jMM-jDD").add(d,"months").format("jYYYY-jMM-jDD")); };
  const formatTime = (t) => t?t.substring(0,5):"-";

  const getWeekDays = () => { 
    const cm = moment(selectedDate,"jYYYY-jMM-jDD"); 
    const sw = cm.clone().startOf("week"); 
    return Array.from({length:7},(_,i)=>{ 
      const day=sw.clone().add(i,"days"); 
      return { 
        date:day.format("jYYYY-jMM-jDD"), 
        dayName:day.format("dddd"), 
        dayNumber:day.format("jDD"), 
        isToday:day.format("jYYYY-jMM-jDD")===moment().format("jYYYY-jMM-jDD") 
      }; 
    }); 
  };
  const weekDays = getWeekDays();

  const monthNames = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

  const handleMonthIconClick = () => {
    if (isDesktop) {
      setShowMonthPicker(!showMonthPicker);
    }
    // توی موبایل و تبلت هیچ کاری نمی‌کنه
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen" dir="rtl">
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalSlideUp { from { opacity:0; transform:translateY(30px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 12px; transition: all .3s; }
        @media (min-width: 640px) { .stat-card { border-radius: 18px; padding: 16px; } }
        .class-item { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px 14px; transition: all .3s; cursor: pointer; }
        @media (min-width: 640px) { .class-item { border-radius: 14px; padding: 14px 18px; } }
        .class-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(139,92,246,0.15); transform: translateY(-2px); }
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 12px 14px; font-size: .85rem; width: 100%; text-align: right; transition: all .25s; }
        @media (min-width: 640px) { .glass-input { padding: 14px 16px; font-size: .9rem; } }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08); background: rgba(15,23,42,0.95)!important; }
        
        .calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        @media (min-width: 640px) { .calendar-header { margin-bottom: 20px; } }
        .month-indicator { display: flex; align-items: center; gap: 10px; background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.12); padding: 6px 14px; border-radius: 40px; position: relative; }
        @media (min-width: 640px) { .month-indicator { gap: 14px; padding: 8px 18px; } }
        .month-icon { width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #8b5cf6, #6366f1); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        @media (min-width: 640px) { .month-icon { width: 38px; height: 38px; border-radius: 12px; } }
        .month-icon-desktop:hover { transform: scale(1.05); }
        .month-text { font-size: 0.8rem; font-weight: 700; background: linear-gradient(135deg, #a78bfa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @media (min-width: 640px) { .month-text { font-size: 0.95rem; } }
        .nav-btn { width: 34px; height: 34px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; color: #94a3b8; }
        @media (min-width: 640px) { .nav-btn { width: 40px; height: 40px; border-radius: 12px; } }
        .nav-btn:hover { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.25); color: #a78bfa; }
        .today-btn { padding: 6px 12px; border-radius: 30px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; font-size: 0.7rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        @media (min-width: 640px) { .today-btn { padding: 8px 16px; font-size: 0.78rem; } }
        .today-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(139,92,246,0.3); }
        .week-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 3px; }
        @media (min-width: 640px) { .week-grid { gap: 5px; } }
        .day-cell { position: relative; padding: 8px 2px; border-radius: 12px; cursor: pointer; transition: all 0.3s; background: rgba(255,255,255,0.02); border: 2px solid transparent; text-align: center; }
        @media (min-width: 640px) { .day-cell { padding: 12px 4px; border-radius: 16px; } }
        .day-cell:hover { border-color: rgba(139,92,246,0.2); transform: translateY(-2px); }
        .day-cell.selected { background: linear-gradient(135deg, #8b5cf6, #6366f1); border-color: #8b5cf6; }
        .day-cell.today { border-color: rgba(139,92,246,0.4); }
        .day-name { font-size: 0.58rem; font-weight: 600; color: #94a3b8; margin-bottom: 4px; }
        @media (min-width: 640px) { .day-name { font-size: 0.68rem; margin-bottom: 6px; } }
        .day-cell.selected .day-name { color: rgba(255,255,255,0.9); }
        .day-cell.today:not(.selected) .day-name { color: #a78bfa; }
        .day-number { font-size: 0.9rem; font-weight: 700; color: #e2e8f0; }
        @media (min-width: 640px) { .day-number { font-size: 1.2rem; } }
        .day-cell.selected .day-number { color: white; }
        .day-cell.today:not(.selected) .day-number { color: #a78bfa; }
        .day-badge { position: absolute; top: -5px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; font-size: 7px; font-weight: 700; padding: 1px 5px; border-radius: 6px; white-space: nowrap; }
        @media (min-width: 640px) { .day-badge { top: -6px; font-size: 8px; padding: 1px 7px; border-radius: 8px; } }

        @keyframes fadeIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
        .animate-in { animation: fadeIn 0.15s ease-out; }
        
        .picker-container { width: 520px; }
        .picker-row { display: flex; gap: 6px; overflow-x: auto; scroll-behavior: smooth; padding: 2px 0; flex: 1; min-width: 200px; }
        .picker-btn { flex-shrink: 0; padding: 10px 18px; border-radius: 10px; cursor: pointer; transition: all 0.2s; text-align: center; color: #cbd5e1; font-size: 0.82rem; font-weight: 500; border: 1px solid rgba(255,255,255,0.05); white-space: nowrap; background: transparent; }
        .picker-btn:hover { color: #fff; border-color: rgba(139,92,246,0.2); background: rgba(139,92,246,0.05); }
        .picker-btn.selected { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; font-weight: 700; border-color: transparent; }
        
        .picker-header { display: flex; align-items: center; gap: 10px; }
        .year-nav { display: flex; align-items: center; justify-content: center; gap: 10px; flex-shrink: 0; }
        .year-nav-btn { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; transition: all 0.15s; }
        .year-nav-btn:hover { background: rgba(139,92,246,0.12); color: #a78bfa; }
        .year-display { font-size: 1rem; font-weight: 700; min-width: 55px; text-align: center; background: linear-gradient(135deg, #a78bfa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        
        .page-title { font-size: 1.8rem; font-weight: 900; background: linear-gradient(135deg, #a78bfa, #818cf8, #c084fc, #f472b6); background-size: 300% 300%; animation: gradient-shift 4s ease infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2; }
        @media (min-width: 640px) { .page-title { font-size: 2.2rem; } }
        @media (min-width: 768px) { .page-title { font-size: 2.5rem; } }

        /* دکمه‌های ماه قبلی/بعدی برای موبایل */
        .month-nav-mobile { display: flex; align-items: center; gap: 8px; }
        @media (min-width: 1024px) { .month-nav-mobile { display: none; } }
      `}</style>

      <div className="mb-6 sm:mb-10 text-right">
        <h1 className="page-title mb-1 sm:mb-2">تقویم کلاس‌ها</h1>
        <p className="text-gray-400 text-xs sm:text-sm">مشاهده و ثبت حضور و غیاب کلاس‌های روزانه</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {[{l:"کل",v:stats?.totalClasses||0,c:"text-blue-400",icon:"📅"},{l:"حاضر",v:stats?.attendedClasses||0,c:"text-emerald-400",icon:"✅"},{l:"غایب",v:stats?.absentClasses||0,c:"text-red-400",icon:"❌"},{l:"در انتظار",v:stats?.pendingClasses||0,c:"text-amber-400",icon:"⏳"},{l:"ساعت",v:stats?.totalHours?.toFixed(1)||0,c:"text-purple-400",icon:"⏰"}].map((s,i)=>(
          <div key={i} className="stat-card text-right" style={{animation:`slideUp 0.4s ease-out ${i*0.06}s both`}}>
            <div className="flex items-center justify-between">
              <div><div className={`text-lg sm:text-2xl font-extrabold ${s.c}`}>{s.v}</div><div className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{s.l}</div></div>
              <div className="text-base sm:text-xl opacity-50">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 sm:p-5 mb-6">
        <div className="calendar-header">
          <div className="month-indicator">
            {/* دکمه تقویم - فقط دسکتاپ */}
            <div 
              className={`month-icon ${isDesktop ? 'month-icon-desktop' : ''}`} 
              onClick={handleMonthIconClick}
              style={{ cursor: isDesktop ? 'pointer' : 'default' }}
            >
              <Calendar size={18} className="sm:w-5 sm:h-5"/>
            </div>
            <div>
              <div className="month-text">{moment(selectedDate,"jYYYY-jMM-jDD").format("jMMMM jYYYY")}</div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">هفته {moment(selectedDate,"jYYYY-jMM-jDD").jWeek()}</div>
            </div>

            {/* دکمه‌های تغییر ماه برای موبایل/تبلت */}
            <div className="month-nav-mobile">
              <button onClick={()=>changeMonth(-1)} className="nav-btn"><ChevronRight size={14}/></button>
              <button onClick={()=>changeMonth(1)} className="nav-btn"><ChevronLeft size={14}/></button>
            </div>

            {showMonthPicker && isDesktop && (
              <>
                <div className="fixed inset-0 z-40" onClick={()=>setShowMonthPicker(false)}/>
                <div className="absolute top-full right-0 mt-2 z-50 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-3 animate-in picker-container">
                  <div className="picker-header">
                    <div className="year-nav">
                      <button className="year-nav-btn" onClick={()=>setPickerYear(pickerYear-1)}><ChevronRight size={14}/></button>
                      <span className="year-display">{pickerYear}</span>
                      <button className="year-nav-btn" onClick={()=>setPickerYear(pickerYear+1)}><ChevronLeft size={14}/></button>
                    </div>
                    <div className="picker-row">
                      {monthNames.map((mn,i)=>{
                        const mn2=i+1;
                        const cj=moment(selectedDate,"jYYYY-jMM-jDD");
                        const isSel=pickerYear===cj.jYear()&&mn2===cj.jMonth()+1;
                        return(<button key={i} className={`picker-btn ${isSel?"selected":""}`} onClick={()=>{setSelectedDate(moment(`${pickerYear}/${mn2}/01`,"jYYYY/jMM/jDD").format("jYYYY-jMM-jDD"));setShowMonthPicker(false);}}>{mn}</button>);
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={()=>{setSelectedDate(moment().format("jYYYY-jMM-jDD"));setShowMonthPicker(false);}} className="today-btn">امروز</button>
            <button onClick={()=>changeDate(-7)} className="nav-btn"><ChevronRight size={14} className="sm:w-4 sm:h-4"/></button>
            <button onClick={()=>changeDate(7)} className="nav-btn"><ChevronLeft size={14} className="sm:w-4 sm:h-4"/></button>
          </div>
        </div>
        <div className="week-grid">
          {weekDays.map((day,i)=>(
            <div key={i} onClick={()=>setSelectedDate(day.date)} className={`day-cell ${day.date===selectedDate?"selected":""} ${day.isToday?"today":""}`}>
              {day.isToday&&<div className="day-badge">امروز</div>}
              <div className="day-name">{day.dayName}</div>
              <div className="day-number">{day.dayNumber}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-16 sm:py-20"><div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div> : classes.length===0 ? (
        <div className="glass-card rounded-2xl p-10 sm:p-16 text-center"><Calendar size={36} className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-30"/><p className="text-gray-400 text-sm sm:text-base">کلاسی برای این روز ثبت نشده</p></div>
      ) : (
        <div className="space-y-2">
          {classes.map(cls=>(
            <div key={cls._id} onClick={()=>openAttendanceModal(cls)} className="class-item">
              <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{cls.title?.charAt(0)?.toUpperCase()||"?"}</div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-xs sm:text-sm truncate">{cls.title}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">{cls.company?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[10px] sm:text-xs text-gray-300">{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${statusColors[cls.status]}`}>{statusText[cls.status]}</span>
                  {cls.attended&&<span className="text-[9px] sm:text-[10px] text-emerald-400">{cls.hoursTaught}ساعت</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {attendanceModal && selectedClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[95vw] sm:max-w-[480px] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl" style={{background:"linear-gradient(160deg,#0f172a 0%,#0a0f1a 100%)",animation:"modalSlideUp 0.3s ease-out"}} dir="rtl">
            <div className="p-4 sm:p-6 pb-2 sm:pb-3" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.06) 0%,rgba(236,72,153,0.03) 50%,transparent 100%)"}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"><CheckCircle size={18} className="sm:w-[22px] sm:h-[22px] text-white"/></div>
                  <div><h2 className="text-lg sm:text-xl font-extrabold text-white">ثبت حضور/غیاب</h2><p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{selectedClass.title}</p></div>
                </div>
                <button onClick={()=>setAttendanceModal(false)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center"><X size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400"/></button>
              </div>
            </div>
            <div className="p-4 sm:p-6 pt-2 sm:pt-3 space-y-3 sm:space-y-4">
              <div><label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1">وضعیت</label><div className="flex gap-2">
                <button onClick={()=>setAttendanceForm({...attendanceForm,attended:true})} className={`flex-1 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition ${attendanceForm.attended?"bg-emerald-500/20 border-emerald-500/50 text-emerald-400":"bg-white/5 border-white/10 text-gray-400"}`}>✅ حاضر</button>
                <button onClick={()=>setAttendanceForm({...attendanceForm,attended:false,hoursTaught:0})} className={`flex-1 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition ${!attendanceForm.attended?"bg-red-500/20 border-red-500/50 text-red-400":"bg-white/5 border-white/10 text-gray-400"}`}>❌ غایب</button>
              </div></div>
              {attendanceForm.attended&&<div><label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1">ساعت تدریس</label><input type="number" step="0.5" min="0" max="24" className="glass-input" value={attendanceForm.hoursTaught} onChange={(e)=>setAttendanceForm({...attendanceForm,hoursTaught:parseFloat(e.target.value)||0})}/></div>}
              <div><label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1">یادداشت</label><textarea className="glass-input min-h-[60px] sm:min-h-[70px] resize-y" rows={2} value={attendanceForm.notes} onChange={(e)=>setAttendanceForm({...attendanceForm,notes:e.target.value})}/></div>
              <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button onClick={handleSubmitAttendance} className="flex-1 py-2.5 sm:py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}><Save size={14} className="sm:w-4 sm:h-4"/>ثبت</button>
                <button onClick={()=>setAttendanceModal(false)} className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gray-700/50 text-xs sm:text-sm">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}