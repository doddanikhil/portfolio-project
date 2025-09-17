'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xl animate-pulse border border-white/30" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 hover:bg-white/40 dark:hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center group overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
      
      <div className="relative z-10">
        {isDark ? (
          <Sun 
            size={18} 
            className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg" 
          />
        ) : (
          <Moon 
            size={18} 
            className="text-blue-600 group-hover:text-blue-500 transition-colors duration-300 drop-shadow-lg" 
          />
        )}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
    </button>
  );
}