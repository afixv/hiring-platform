import React, { useState, useRef, useEffect } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import "./calendar.css";

type CalendarView = "day" | "month" | "year" | "decade";

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  isOpen?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, isOpen }) => {
  const [view, setView] = useState<CalendarView>("day");
  const [currentDate, setCurrentDate] = useState<Date>(
    selectedDate || new Date()
  );
  const [openDirection, setOpenDirection] = useState<"bottom" | "top">("bottom");
  const calendarRef = useRef<HTMLDivElement>(null);

  const daysOfWeek: string[] = ["S", "M", "T", "W", "T", "F", "S"];
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Detect if calendar should open above or below
  useEffect(() => {
    if (isOpen && calendarRef.current?.parentElement) {
      const triggerElement = calendarRef.current.parentElement;
      const triggerRect = triggerElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Approximate calendar height based on current view
      let calendarHeight = 350; // Default for day view
      if (view === "month") calendarHeight = 280;
      if (view === "year") calendarHeight = 280;
      if (view === "decade") calendarHeight = 280;

      // Add padding and gap (10px)
      const totalHeightNeeded = calendarHeight + 10;
      
      // Space available below trigger
      const spaceBelow = viewportHeight - triggerRect.bottom;
      
      // Space available above trigger
      const spaceAbove = triggerRect.top;

      // If not enough space below and more space above, open top
      if (spaceBelow < totalHeightNeeded && spaceAbove > totalHeightNeeded) {
        setOpenDirection("top");
      } else {
        setOpenDirection("bottom");
      }
    }
  }, [isOpen, view]);

  const changeMonth = (offset: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  const changeYear = (offset: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1)
    );
  };

  const changeDecade = (offset: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear() + offset * 10,
        currentDate.getMonth(),
        1
      )
    );
  };
  const renderDayView = (): React.ReactElement => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dates: React.ReactElement[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      dates.push(
        <div key={`prev-${i}`} className="calendar-cell other-month">
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      dates.push(
        <div
          key={day}
          className={`calendar-cell ${isSelected ? "selected" : ""}`}
          onClick={() => onDateChange(date)}>
          {day}
        </div>
      );
    }

    const totalCells = dates.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let day = 1; day <= remainingCells; day++) {
      dates.push(
        <div key={`next-${day}`} className="calendar-cell other-month">
          {day}
        </div>
      );
    }

    return (
      <>
        <div className="calendar-header">
          <button className="nav-button" onClick={() => changeYear(-1)}>
            <MdKeyboardDoubleArrowLeft size={18} />
          </button>
          <button className="nav-button" onClick={() => changeMonth(-1)}>
            <MdChevronLeft size={18} />
          </button>
          <span className="header-title" onClick={() => setView("month")}>
            {months[month]} {year}
          </span>
          <button className="nav-button" onClick={() => changeMonth(1)}>
            <MdChevronRight size={18} />
          </button>
          <button className="nav-button" onClick={() => changeYear(1)}>
            <MdKeyboardDoubleArrowRight size={18} />
          </button>
        </div>
        <div className="calendar-grid days-of-week">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day-name">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">{dates}</div>
      </>
    );
  };

  const renderMonthView = (): React.ReactElement => {
    const year = currentDate.getFullYear();
    return (
      <>
        <div className="calendar-header">
          <button className="nav-button" onClick={() => changeYear(-1)}>
            <MdKeyboardDoubleArrowLeft size={18} />
          </button>
          <span className="header-title" onClick={() => setView("year")}>
            {year}
          </span>
          <button className="nav-button" onClick={() => changeYear(1)}>
            <MdKeyboardDoubleArrowRight size={18} />
          </button>
        </div>
        <div className="calendar-grid month-grid">
          {months.map((month, index) => (
            <div
              key={month}
              className="calendar-cell"
              onClick={() => {
                setCurrentDate(new Date(year, index, 1));
                setView("day");
              }}>
              {month}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderYearView = (): React.ReactElement => {
    const year = currentDate.getFullYear();
    const startYear = Math.floor(year / 10) * 10;
    const years: React.ReactElement[] = [];
    for (let i = 0; i < 12; i++) {
      const currentYear = startYear + i - 1;
      years.push(
        <div
          key={currentYear}
          className={`calendar-cell ${
            i === 0 || i === 11 ? "other-month" : ""
          }`}
          onClick={() => {
            setCurrentDate(new Date(currentYear, currentDate.getMonth(), 1));
            setView("month");
          }}>
          {currentYear}
        </div>
      );
    }
    return (
      <>
        <div className="calendar-header">
          <button className="nav-button" onClick={() => changeDecade(-1)}>
            <MdKeyboardDoubleArrowLeft size={18} />
          </button>
          <span className="header-title" onClick={() => setView("decade")}>
            {startYear} - {startYear + 9}
          </span>
          <button className="nav-button" onClick={() => changeDecade(1)}>
            <MdKeyboardDoubleArrowRight size={18} />
          </button>
        </div>
        <div className="calendar-grid year-grid">{years}</div>
      </>
    );
  };

  const renderDecadeView = (): React.ReactElement => {
    const year = currentDate.getFullYear();
    const startDecade = Math.floor(year / 100) * 100;
    const decades: React.ReactElement[] = [];
    for (let i = 0; i < 12; i++) {
      const decadeStart = startDecade + (i - 1) * 10;
      const decadeEnd = decadeStart + 9;
      decades.push(
        <div
          key={decadeStart}
          className={`calendar-cell ${
            i === 0 || i === 11 ? "other-month" : ""
          }`}
          onClick={() => {
            setCurrentDate(new Date(decadeStart, 0, 1));
            setView("year");
          }}>
          {decadeStart}-{decadeEnd}
        </div>
      );
    }

    return (
      <>
        <div className="calendar-header">
          <button
            className="nav-button"
            onClick={() => {
              /* Logika abad */
            }}>
            <MdKeyboardDoubleArrowLeft size={18} />
          </button>
          <span className="header-title">
            {startDecade} - {startDecade + 99}
          </span>
          <button
            className="nav-button"
            onClick={() => {
              /* Logika abad */
            }}>
            <MdKeyboardDoubleArrowRight size={18} />
          </button>
        </div>
        <div className="calendar-grid decade-grid">{decades}</div>
      </>
    );
  };

  return (
    <div 
      ref={calendarRef}
      className={`calendar-container ${openDirection === "top" ? "open-top" : "open-bottom"}`}
    >
      {view === "day" && renderDayView()}
      {view === "month" && renderMonthView()}
      {view === "year" && renderYearView()}
      {view === "decade" && renderDecadeView()}
    </div>
  );
};

export default Calendar;
