'use client';

import { useState, useEffect } from 'react';

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fixed positions to avoid hydration mismatch
  const particles = [
    { left: 25, top: 15, delay: 0, duration: 4 },
    { left: 75, top: 25, delay: 0.5, duration: 3.5 },
    { left: 15, top: 60, delay: 1, duration: 4.2 },
    { left: 85, top: 45, delay: 1.5, duration: 3.8 },
    { left: 45, top: 80, delay: 2, duration: 4.5 },
    { left: 65, top: 10, delay: 2.5, duration: 3.2 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Light mode gradient - more vibrant */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:opacity-0 transition-opacity duration-1000" />
      
      {/* Dark mode gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 opacity-0 dark:opacity-100 transition-opacity duration-1000" />
      
      {/* Animated orbs - Light mode (more visible) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 dark:opacity-0 rounded-full blur-3xl animate-pulse transition-opacity duration-1000" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-400/30 dark:opacity-0 rounded-full blur-3xl animate-pulse delay-1000 transition-opacity duration-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400/25 dark:opacity-0 rounded-full blur-3xl animate-pulse delay-2000 transition-opacity duration-1000" />
      
      {/* Animated orbs - Dark mode */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 opacity-0 dark:opacity-100 rounded-full blur-3xl animate-pulse transition-opacity duration-1000" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/15 opacity-0 dark:opacity-100 rounded-full blur-3xl animate-pulse delay-1000 transition-opacity duration-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-500/15 opacity-0 dark:opacity-100 rounded-full blur-3xl animate-pulse delay-2000 transition-opacity duration-1000" />
      
      {/* Fixed particles - only render after mount */}
      {mounted && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-500/40 dark:bg-blue-400/20 rounded-full animate-ping"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Additional visual elements for light mode */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:opacity-0 transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)] dark:opacity-0 transition-opacity duration-1000" />
    </div>
  );
}
