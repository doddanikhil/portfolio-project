'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Github, Linkedin, FileText, Calendar } from 'lucide-react';
import { getSiteMetadata, type SiteMetadata } from '@/lib/api';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const pathname = usePathname();

  useEffect(() => {
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

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {siteConfig?.name ? siteConfig.name.split(' ').map(n => n[0]).join('') : 'ND'}
              </span>
            </div>
            <span className="text-white font-semibold hidden sm:block">
              {siteConfig?.name || 'Portfolio'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-400'
                    : 'text-white hover:text-blue-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Social Links */}
          <div className="hidden md:flex items-center space-x-4">
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
            {siteConfig?.calendar_url && (
              <Link
                href={siteConfig.calendar_url}
                target="_blank"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Let's Connect
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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