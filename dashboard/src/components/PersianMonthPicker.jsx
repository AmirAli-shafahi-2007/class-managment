import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";

const monthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const PersianMonthPicker = ({ year, month, onYearChange, onMonthChange, placeholder = "انتخاب ماه و سال" }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);
  
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTempYear(year);
    setTempMonth(month);
  }, [year, month]);

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

  const changeYear = (delta) => {
    setTempYear(tempYear + delta);
  };

  const handleMonthSelect = (selectedMonth) => {
    setTempMonth(selectedMonth);
    onYearChange(tempYear);
    onMonthChange(selectedMonth);
    setShowCalendar(false);
  };

  const getDisplayValue = () => {
    return `${monthNames[month - 1]} ${year}`;
  };

  return (
    <div className="relative" dir="rtl">
      <div ref={inputRef} className="relative">
        <input
          type="text"
          className="glass-input w-full cursor-pointer pr-10"
          value={getDisplayValue()}
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
                onClick={() => changeYear(-1)}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronRight size={20} />
              </button>
              <div className="font-bold text-gray-200">
                سال {tempYear}
              </div>
              <button
                onClick={() => changeYear(1)}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index + 1)}
                  className={`p-2 text-center rounded-lg transition ${
                    tempMonth === index + 1 && tempYear === year
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700 text-gray-200"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianMonthPicker;