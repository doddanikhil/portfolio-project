import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/Navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nikhil Dodda - Applied AI Engineer',
  description: 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure. Building intelligent applications that solve real business problems.',
  keywords: 'AI Engineer, Machine Learning, LLM, RAG, Python, AWS, Software Engineering',
  authors: [{ name: 'Nikhil Dodda' }],
  creator: 'Nikhil Dodda',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iamdevnd.dev',
    title: 'Nikhil Dodda - Applied AI Engineer',
    description: 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure.',
    siteName: 'Nikhil Dodda Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nikhil Dodda - Applied AI Engineer',
    description: 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-900`}>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}