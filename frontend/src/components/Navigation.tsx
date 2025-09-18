'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Github, Linkedin, FileText, Calendar, Sun, Moon } from 'lucide-react';
import { getSiteMetadata, type SiteMetadata } from '@/lib/api';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const fetchConfig = async () => {
      try {
        const config = await getSiteMetadata();
        setSiteConfig(config);
      } catch (error) {
        console.error('Failed to fetch site config:', error);
      }
    };

    fetchConfig();
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

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Connect', href: '/connect' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg animate-pulse"></div>
            <div className="w-32 h-8 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {siteConfig?.name ? siteConfig.name.split(' ').map(n => n[0]).join('') : 'ND'}
              </span>
            </div>
            <span className="text-white dark:text-white font-semibold hidden sm:block">
              {siteConfig?.name || 'Portfolio'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-400'
                    : 'text-white/90 hover:text-blue-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-600" />
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md rounded-lg mt-2 border border-white/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-white hover:text-blue-400 hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Social Links */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/20">
                {siteConfig?.github_url && (
                  <Link
                    href={siteConfig.github_url}
                    target="_blank"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </Link>
                )}
                {siteConfig?.linkedin_url && (
                  <Link
                    href={siteConfig.linkedin_url}
                    target="_blank"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                )}
                {siteConfig?.resume_url && (
                  <Link
                    href={siteConfig.resume_url}
                    target="_blank"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                  </Link>
                )}
              </div>
              
              {siteConfig?.calendar_url && (
                <div className="pt-2">
                  <Link
                    href={siteConfig.calendar_url}
                    target="_blank"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Let's Connect
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}