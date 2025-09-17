// frontend/src/components/layout/Footer.tsx
'use client';
import { Github, Mail, Calendar, ArrowUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* About */}
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Nikhil Dodda
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <SocialLink href="https://github.com/doddanikhil" icon={Github} label="GitHub" />
                <SocialLink href="mailto:iamdevnd@gmail.com" icon={Mail} label="Email" />
                <SocialLink href="https://cal.com/dnpro" icon={Calendar} label="Schedule Meeting" />
                <SocialLink href="https://bsky.app/profile/devdn.bsky.social" icon={ExternalLink} label="Bluesky" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
              <nav className="space-y-2">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/projects">Projects</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
              <nav className="space-y-2">
                <FooterLink href="/projects?featured=true">Featured Work</FooterLink>
                <FooterLink href="/blog?category=technical">Tech Articles</FooterLink>
                <FooterLink href="/contact">Hire Me</FooterLink>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Nikhil Dodda. Built with Next.js & Django.
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/privacy" 
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Social Link Component
function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all duration-300"
    aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      {children}
    </Link>
  );
}