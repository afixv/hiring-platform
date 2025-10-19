import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import Calendar from "./calendar";
import { Label } from "../label";

interface DatePickerProps {
  label?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, required }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const datePickerRef = useRef<HTMLDivElement | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Select your date of birth";
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const displayText = formatDate(selectedDate);
  const isDateSelected = selectedDate !== null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full" ref={datePickerRef}>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-10 px-4 py-2 rounded-lg border-2 transition-all outline-none flex items-center gap-2
            bg-white border-neutral-40 
            hover:border-primary/20 focus:border-primary
            ${isDateSelected ? "text-neutral-90" : "text-neutral-60"}`}>
          <LuCalendarDays size={16} className="text-neutral-100" />
          <span className="flex-1 text-left text-sm font-normal">
            {displayText}
          </span>
          <MdKeyboardArrowDown
            size={16}
            className={`text-neutral-100 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <Calendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            isOpen={isOpen}
          />
        )}
      </div>
    </div>
  );
};

export default DatePicker;
