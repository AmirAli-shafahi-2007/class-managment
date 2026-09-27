import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const monthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const PersianDatePicker = ({ value, onChange, placeholder = "انتخاب تاریخ" }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  // سال جاری شمسی رو بگیر
  const currentYear = parseInt(moment().format("jYYYY"));
  const currentMonth = parseInt(moment().format("jMM"));
  
  const [currentYearState, setCurrentYearState] = useState(currentYear);
  const [currentMonthState, setCurrentMonthState] = useState(currentMonth);
  
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // تنظیم سال و ماه بر اساس تاریخ فعلی
  useEffect(() => {
    if (value) {
      const [year, month] = value.split("-");
      setCurrentYearState(parseInt(year));
      setCurrentMonthState(parseInt(month));
    }
  }, [value]);

  // بستن تقویم با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // گرفتن روزهای ماه (با در نظر گرفتن کبیسه)
  const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // ماه اسفند - محاسبه کبیسه
    const isLeap = (year % 33 === 1 || year % 33 === 2 || year % 33 === 3 || year % 33 === 29);
    return isLeap ? 30 : 29;
  };

  // گرفتن روز اول ماه (جمعه 0 تا پنجشنبه 6)
  const getFirstDayOfMonth = (year, month) => {
    // ساخت تاریخ میلادی مربوط به اول ماه شمسی
    const m = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD");
    return m.day();
  };

  const handleDateSelect = (day) => {
    const dateString = `${currentYearState}-${String(currentMonthState).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(dateString);
    setShowCalendar(false);
  };

  const changeMonth = (delta) => {
    let newMonth = currentMonthState + delta;
    let newYear = currentYearState;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setCurrentMonthState(newMonth);
    setCurrentYearState(newYear);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYearState, currentMonthState);
    const firstDay = getFirstDayOfMonth(currentYearState, currentMonthState);
    const days = [];
    
    // روزهای خالی قبل از شروع ماه
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // روزهای ماه
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = value === `${currentYearState}-${String(currentMonthState).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push(
        <button
          key={i}
          onClick={() => handleDateSelect(i)}
          className={`p-2 text-center rounded-lg transition ${
            isSelected
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 text-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="relative" dir="rtl">
      <div ref={inputRef} className="relative">
        <input
          type="text"
          className="glass-input w-full cursor-pointer pr-10"
          value={value || ""}
          placeholder={placeholder}
          readOnly
          onClick={() => setShowCalendar(!showCalendar)}
        />
        <Calendar
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setShowCalendar(!showCalendar)}
        />
      </div>

      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 w-72"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronRight size={20} />
              </button>
              <div className="font-bold text-gray-200">
                {monthNames[currentMonthState - 1]} {currentYearState}
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, i) => (
                <div key={i} className="text-center text-xs text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;