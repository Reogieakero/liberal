"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function CustomDropdown({ label, options, selectedValue, onChange }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === selectedValue);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: '#ffffff',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '6px',
          padding: '8px 10px',
          fontFamily: 'inherit',
          fontSize: '11px',
          color: '#0f172a',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <span style={{ flexGrow: 1 }}>{selectedOption ? selectedOption.label : 'Select an option'}</span>
        <ChevronDown size={14} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: '#ffffff',
            border: '1px solid rgba(14, 165, 233, 0.15)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '4px'
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: isSelected ? '#0284c7' : '#334155',
                  background: isSelected ? 'rgba(14, 165, 233, 0.06)' : 'transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'between',
                  fontWeight: isSelected ? 500 : 400
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(14, 165, 233, 0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ flexGrow: 1 }}>{option.label}</span>
                {isSelected && <Check size={12} style={{ color: '#0284c7' }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}