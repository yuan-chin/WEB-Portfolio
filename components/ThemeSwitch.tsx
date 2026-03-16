"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import './ThemeSwitch.css';

const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync with existing Vanilla JS theme tracker
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setIsDark(currentTheme === 'dark');

    // Start observer for external toggles
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsDark((mutation.target as HTMLElement).getAttribute('data-theme') === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleChange = () => {
    if (typeof window !== 'undefined' && (window as any).toggleTheme) {
      (window as any).toggleTheme();
    }
  };

  return (
    <div className="checkbox-apple" style={{ margin: '0 10px' }}>
      <input 
        className="yep" 
        id="check-apple" 
        type="checkbox" 
        checked={isDark}
        onChange={handleChange}
        aria-label="Toggle Theme"
      />
      <label htmlFor="check-apple">
        <Moon className="ts-icon ts-moon" size={14} />
        <Sun className="ts-icon ts-sun" size={14} />
      </label>
    </div>
  );
};

export default ThemeSwitch;
