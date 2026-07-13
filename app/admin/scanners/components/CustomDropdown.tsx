"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [popoverRect, setPopoverRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Recompute the popover's screen position, since it now renders
  // through a portal (outside any blurred/translucent parent panels)
  // instead of being absolutely positioned inside them.
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverRect({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) updatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedWrapper = wrapperRef.current && wrapperRef.current.contains(target);
      const clickedPopover = popoverRef.current && popoverRef.current.contains(target);
      if (!clickedWrapper && !clickedPopover) {
        setIsOpen(false);
      }
    }

    function handleReposition() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen]);

  const selectedOption = options.find(o => o.value === selectedValue);

  const popoverContent = isOpen && popoverRect && (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: popoverRect.top,
        left: popoverRect.left,
        width: popoverRect.width,
        background: '#ffffff',
        border: '1px solid rgba(14, 165, 233, 0.15)',
        borderRadius: '6px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        zIndex: 9999,
        maxHeight: '220px',
        overflowY: 'auto',
        padding: '4px',
        boxSizing: 'border-box'
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
              justifyContent: 'space-between',
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
  );

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>{label}</label>

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
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
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <span style={{ flexGrow: 1 }}>{selectedOption ? selectedOption.label : 'Select an option'}</span>
        <ChevronDown size={14} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {mounted && popoverContent ? createPortal(popoverContent, document.body) : null}
    </div>
  );
}