"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  label: string;
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
}

export default function CustomDatePicker({ label, value, onChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current date value or fallback to today
  const selectedDate = value ? new Date(value) : new Date();
  
  // Track month/year view inside the popover
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth()); // 0-indexed

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper calculation details
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const paddedMonth = (currentMonth + 1).toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    const formattedDate = `${currentYear}-${paddedMonth}-${paddedDay}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Pick a date";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate grid items
  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarGrid = [...blanks, ...days];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: '#ffffff',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontFamily: 'inherit',
          fontSize: '11px',
          color: value ? '#0f172a' : '#64748b',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <span>{formatDisplayDate(value)}</span>
        <CalendarIcon size={13} style={{ color: '#64748b' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '6px',
            background: '#ffffff',
            border: '1px solid rgba(14, 165, 233, 0.15)',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
            zIndex: 1000,
            padding: '12px',
            width: '240px',
          }}
        >
          {/* Calendar Header Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                background: 'transparent',
                border: '1px solid rgba(14, 165, 233, 0.15)',
                borderRadius: '4px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}
            >
              <ChevronLeft size={13} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
              {months[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: 'transparent',
                border: '1px solid rgba(14, 165, 233, 0.15)',
                borderRadius: '4px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px' }}>
            {daysOfWeek.map((day) => (
              <span key={day} style={{ fontSize: '9px', fontWeight: 500, color: '#64748b' }}>
                {day}
              </span>
            ))}
          </div>

          {/* Monthly Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {calendarGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }

              const checkDate = new Date(currentYear, currentMonth, day);
              const isSelected = 
                selectedDate &&
                checkDate.getDate() === selectedDate.getDate() &&
                checkDate.getMonth() === selectedDate.getMonth() &&
                checkDate.getFullYear() === selectedDate.getFullYear();

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  style={{
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 0',
                    fontSize: '10px',
                    fontFamily: 'inherit',
                    background: isSelected ? '#0284c7' : 'transparent',
                    color: isSelected ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(14, 165, 233, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}