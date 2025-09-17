'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - responsive sizing */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-300 min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">N</span>
            </div>
            <span className="hidden sm:block text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              Nikhil Dodda
            </span>
          </Link>
          
          {/* Desktop Navigation - better spacing */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-lg lg:rounded-xl transition-all duration-300 whitespace-nowrap ${
                  pathname === href
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls - better touch targets */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="glass-button p-3 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - improved touch targets */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20 dark:border-gray-700/50">
            <nav className="flex flex-col space-y-1">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-4 text-base font-medium rounded-xl transition-all duration-300 min-h-[44px] flex items-center ${
                    pathname === href
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}