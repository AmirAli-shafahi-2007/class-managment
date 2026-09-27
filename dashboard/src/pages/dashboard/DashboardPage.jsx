import { useEffect, useState } from "react";
import reportService from "../../services/reportService";
import todoService from "../../services/todoService";
import companyService from "../../services/companyService";
import classTemplateService from "../../services/classTemplateService";
import contractService from "../../services/contractService";
import { toast } from "../../components/Toast";
import { DollarSign, Building2, CheckSquare, FileText, TrendingUp, TrendingDown, Clock, BookOpen, Sparkles, ArrowUp, ArrowDown, Calendar, Users } from "lucide-react";
import moment from "moment-jalaali";
import { Link } from "react-router-dom";

moment.loadPersian({ dialect: "persian-modern" });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    income: 0, lastMonthIncome: 0, todos: [], companiesCount: 0,
    classesCount: 0, contractsCount: 0, activeContracts: 0,
    completedTasks: 0, upcomingClasses: [], recentContracts: [],
  });

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const y = now.getFullYear(), m = now.getMonth() + 1;
      const prevM = m === 1 ? 12 : m - 1, prevY = m === 1 ? y - 1 : y;

      const [incomeRes, lastMonthIncomeRes, todosRes, companiesRes, classesRes, contractsRes] = await Promise.all([
        reportService.monthlyIncome(y, m), reportService.monthlyIncome(prevY, prevM),
        todoService.getAll(), companyService.getAll(), classTemplateService.getAll(), contractService.getAll(),
      ]);

      const todos = todosRes?.data || [], companies = companiesRes?.data || [];
      const classes = classesRes?.data || [], contracts = contractsRes?.data || [];

      setStats({
        income: incomeRes?.data?.[0]?.totalIncome || 0,
        lastMonthIncome: lastMonthIncomeRes?.data?.[0]?.totalIncome || 0,
        todos, companiesCount: companies.length, classesCount: classes.length,
        contractsCount: contracts.length,
        activeContracts: contracts.filter(c => c.status === "active").length,
        completedTasks: todos.filter(t => t.completed || t.done || t.status === "done").length,
        upcomingClasses: classes.slice(0, 5),
        recentContracts: contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
      });
    } catch (err) { toast.error("خطا در بارگذاری داشبورد"); }
    setLoading(false);
  };

  const incomeGrowth = stats.lastMonthIncome > 0 ? (((stats.income - stats.lastMonthIncome) / stats.lastMonthIncome) * 100).toFixed(1) : 0;
  const formatMoney = (n) => (!n ? "0" : Number(n).toLocaleString());
  const formatDate = (date) => date ? moment(date).format("jYYYY/jMM/jDD") : "-";
  const dayLabels = { saturday: "ش", sunday: "ی", monday: "د", tuesday: "س", wednesday: "چ", thursday: "پ", friday: "ج" };

  const statCards = [
    { title: "درآمد ماه", value: formatMoney(stats.income), suffix: "تومان", icon: <DollarSign size={20} />, bgColor: "bg-emerald-500/10", iconColor: "text-emerald-400", borderColor: "border-emerald-500/20", growth: incomeGrowth, gradient: "from-emerald-500/20" },
    { title: "مؤسسات", value: stats.companiesCount, suffix: "مؤسسه", icon: <Building2 size={20} />, bgColor: "bg-blue-500/10", iconColor: "text-blue-400", borderColor: "border-blue-500/20", gradient: "from-blue-500/20" },
    { title: "قراردادهای فعال", value: stats.activeContracts, suffix: `از ${stats.contractsCount}`, icon: <FileText size={20} />, bgColor: "bg-purple-500/10", iconColor: "text-purple-400", borderColor: "border-purple-500/20" },
    { title: "کلاس‌ها", value: stats.classesCount, suffix: "کلاس", icon: <BookOpen size={20} />, bgColor: "bg-orange-500/10", iconColor: "text-orange-400", borderColor: "border-orange-500/20" },
    { title: "تسک‌های انجام شده", value: stats.completedTasks, suffix: `از ${stats.todos.length}`, icon: <CheckSquare size={20} />, bgColor: "bg-cyan-500/10", iconColor: "text-cyan-400", borderColor: "border-cyan-500/20" },
  ];

  const quickActions = [
    { label: "ثبت تراکنش", link: "/finance", icon: <DollarSign size={15} />, color: "from-green-500 to-emerald-600" },
    { label: "افزودن تسک", link: "/todo", icon: <CheckSquare size={15} />, color: "from-blue-500 to-indigo-600" },
    { label: "قرارداد جدید", link: "/contract", icon: <FileText size={15} />, color: "from-purple-500 to-pink-600" },
    { label: "کلاس جدید", link: "/classes", icon: <BookOpen size={15} />, color: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen" dir="rtl">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        
        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 16px;
          transition: all 0.3s;
        }
        @media (min-width: 640px) {
          .stat-card { padding: 20px; border-radius: 24px; }
        }
        .stat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12); }
        
        .icon-circle {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        @media (min-width: 640px) {
          .icon-circle { width: 52px; height: 52px; border-radius: 16px; }
        }
        
        .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 14px; transition: all 0.3s;
        }
        @media (min-width: 640px) {
          .glass-card { border-radius: 20px; padding: 20px; }
        }
        
        .quick-action-btn {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 12px 14px; transition: all 0.3s;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        @media (min-width: 640px) {
          .quick-action-btn { border-radius: 14px; padding: 14px 18px; gap: 10px; }
        }
        .quick-action-btn:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
        
        .timeline-item { position: relative; padding-right: 20px; margin-bottom: 8px; }
        .timeline-item::before { content: ''; position: absolute; right: -2px; top: 10px; width: 8px; height: 8px; border-radius: 50%; background: rgba(139,92,246,0.4); border: 2px solid rgba(139,92,246,0.6); z-index: 1; }
        .timeline-item::after { content: ''; position: absolute; right: 1px; top: 22px; width: 2px; height: calc(100% - 14px); background: linear-gradient(180deg, rgba(139,92,246,0.3), transparent); }
        .timeline-item:last-child::after { display: none; }
        
        .task-row { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .task-row:last-child { border-bottom: none; }
        
        .section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        
        .progress-bar { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); overflow: hidden; }
        @media (min-width: 640px) {
          .progress-bar { height: 10px; border-radius: 5px; }
        }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 1.5s; background: linear-gradient(90deg, #10b981, #059669, #10b981); background-size: 200% 100%; animation: shimmer 3s infinite; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles size={16} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              داشبورد اصلی
            </h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mr-10 sm:mr-13">خلاصه وضعیت سیستم</p>
        </div>
        <div className="text-xs sm:text-sm text-gray-400 bg-white/5 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 border border-white/5 flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <Calendar size={12} className="sm:w-[14px] sm:h-[14px] text-purple-400" />
          {moment().format("jDD jMMMM jYYYY")}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 sm:py-32">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 sm:mt-6 text-xs sm:text-sm">در حال بارگذاری...</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.link} className="quick-action-btn group">
                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white`}>
                  {action.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className={`stat-card border ${stat.borderColor}`} style={{ animation: `slideUp 0.5s ${i * 0.06}s both` }}>
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`icon-circle ${stat.bgColor} ${stat.iconColor}`}>{stat.icon}</div>
                  {stat.growth !== undefined && (
                    <div className={`flex items-center gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${stat.growth >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                      {stat.growth >= 0 ? <ArrowUp size={8} className="sm:w-2.5 sm:h-2.5" /> : <ArrowDown size={8} className="sm:w-2.5 sm:h-2.5" />}
                      {Math.abs(stat.growth)}%
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-white">
                    {stat.value}
                    <span className="text-[10px] sm:text-xs font-normal text-gray-500 mr-1">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-400 text-[10px] sm:text-xs mt-1">{stat.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Classes */}
            <div className="glass-card">
              <div className="section-header">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2"><BookOpen size={16} className="sm:w-[18px] sm:h-[18px] text-orange-400" />کلاس‌ها</h3>
                <Link to="/calendar" className="text-[10px] sm:text-xs text-purple-400">مشاهده همه →</Link>
              </div>
              {stats.upcomingClasses.length === 0 ? (
                <div className="text-center py-8 sm:py-10 opacity-50"><BookOpen size={28} className="sm:w-9 sm:h-9 text-gray-600 mx-auto mb-2" /><p className="text-gray-500 text-xs">کلاسی نیست</p></div>
              ) : (
                <div className="space-y-1">
                  {stats.upcomingClasses.map((cls, i) => (
                    <div key={i} className="timeline-item">
                      <div className="bg-white/[0.02] rounded-xl p-2.5 sm:p-3.5">
                        <div className="flex justify-between items-start">
                          <p className="text-white font-medium text-xs sm:text-sm">{cls.title || "بدون عنوان"}</p>
                          <span className="text-[9px] sm:text-[10px] text-orange-400 bg-orange-500/10 px-1.5 sm:px-2 py-0.5 rounded-full">{dayLabels[cls.dayOfWeek] || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-gray-500 mt-1.5 sm:mt-2">
                          <span className="truncate">{cls.company?.name || "-"}</span>
                          <span>•</span>
                          <span className="flex-shrink-0">{cls.startTime} - {cls.endTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contracts */}
            <div className="glass-card">
              <div className="section-header">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2"><FileText size={16} className="sm:w-[18px] sm:h-[18px] text-purple-400" />قراردادهای اخیر</h3>
                <Link to="/contract" className="text-[10px] sm:text-xs text-purple-400">مشاهده همه →</Link>
              </div>
              {stats.recentContracts.length === 0 ? (
                <div className="text-center py-8 sm:py-10 opacity-50"><FileText size={28} className="sm:w-9 sm:h-9 text-gray-600 mx-auto mb-2" /><p className="text-gray-500 text-xs">قراردادی نیست</p></div>
              ) : (
                <div className="space-y-1">
                  {stats.recentContracts.map((contract, i) => (
                    <div key={i} className="timeline-item">
                      <div className="bg-white/[0.02] rounded-xl p-2.5 sm:p-3.5">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1 ml-2">
                            <p className="text-white font-medium text-xs sm:text-sm truncate">{contract.title || "بدون عنوان"}</p>
                            <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 truncate">{contract.company?.name || "-"}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs sm:text-sm font-bold text-emerald-400">{formatMoney(contract.totalAmount)}</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-500">تومان</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.03]">
                          <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full ${contract.status === "active" ? "bg-emerald-500/10 text-emerald-400" : contract.status === "finished" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>
                            {contract.status === "active" ? "فعال" : contract.status === "finished" ? "پایان‌یافته" : "لغو شده"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-gray-600">{formatDate(contract.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="glass-card">
            <div className="section-header">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2"><CheckSquare size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />خلاصه تسک‌ها</h3>
              <Link to="/todo" className="text-[10px] sm:text-xs text-purple-400">مشاهده همه →</Link>
            </div>
            <div className="mb-4 sm:mb-5">
              <div className="flex justify-between text-[10px] sm:text-xs mb-2">
                <span className="text-gray-500">پیشرفت</span>
                <span className="font-bold text-emerald-400">{stats.todos.length > 0 ? Math.round((stats.completedTasks / stats.todos.length) * 100) : 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.todos.length > 0 ? (stats.completedTasks / stats.todos.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              {stats.todos.slice(0, 5).map((todo, i) => (
                <div key={i} className="task-row flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${todo.completed || todo.done || todo.status === "done" ? "bg-emerald-500/20 border-emerald-500/40" : "border-white/10"}`}>
                      {(todo.completed || todo.done || todo.status === "done") && <CheckSquare size={10} className="sm:w-[11px] sm:h-[11px] text-emerald-400" />}
                    </div>
                    <span className={`text-xs sm:text-sm truncate ${todo.completed || todo.done || todo.status === "done" ? "text-gray-600 line-through" : "text-gray-300"}`}>{todo.title || "تسک"}</span>
                  </div>
                  {todo.priority && (
                    <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${todo.priority === "high" ? "bg-red-500/10 text-red-400" : todo.priority === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {todo.priority === "high" ? "بالا" : todo.priority === "medium" ? "متوسط" : "کم"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}