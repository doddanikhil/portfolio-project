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
      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl animate-pulse border border-white/20" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:scale-110 hover:rotate-6 transition-all duration-500 flex items-center justify-center group overflow-hidden shadow-lg hover:shadow-2xl"
      aria-label="Toggle theme"
    >
      {/* Liquid glass effect background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated shimmer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
        isDark 
          ? 'shadow-[0_0_20px_rgba(250,204,21,0.3)] group-hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]'
          : 'shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'
      }`} />
      
      <div className="relative z-10 transition-all duration-500 group-hover:scale-110">
        {isDark ? (
          <Sun 
            size={20} 
            className="text-yellow-400 group-hover:text-yellow-300 transition-all duration-500 drop-shadow-lg group-hover:rotate-180" 
          />
        ) : (
          <Moon 
            size={20} 
            className="text-blue-600 group-hover:text-blue-500 transition-all duration-500 drop-shadow-lg group-hover:-rotate-12" 
          />
        )}
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-current rounded-full animate-ping`}
            style={{
              top: `${20 + i * 15}%`,
              left: `${30 + i * 20}%`,
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
    </button>
  );
}