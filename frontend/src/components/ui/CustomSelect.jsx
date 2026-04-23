import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export const CustomSelect = ({ options, value, onChange, placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", isOpen ? "z-50" : "z-10")} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-2 text-sm font-medium hover:border-accent-amber transition-colors focus:outline-none focus:ring-2 focus:ring-accent-amber/50"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`ml-2 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-bg-elevated border border-border-subtle rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5"
          >
            <ul className="py-1 max-h-60 overflow-y-auto custom-scrollbar relative z-10">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                        isSelected 
                          ? 'bg-accent-amber/10 text-accent-amber font-semibold' 
                          : 'text-text-primary hover:bg-bg-tertiary'
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check size={14} className="text-accent-amber shrink-0 ml-2" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
