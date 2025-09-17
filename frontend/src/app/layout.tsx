import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Nikhil Dodda - Applied AI Engineer',
    template: '%s | Nikhil Dodda'
  },
  description: 'Applied AI Engineer specializing in production LLM systems, RAG architectures, and scalable ML infrastructure. Building intelligent applications that solve real business problems.',
  keywords: ['AI Engineer', 'Machine Learning', 'LLM', 'RAG Systems', 'Python', 'AWS', 'MLOps', 'Nikhil Dodda'],
  authors: [{ name: 'Nikhil Dodda' }],
  creator: 'Nikhil Dodda',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nikhildodda.dev',
    title: 'Nikhil Dodda - Applied AI Engineer',
    description: 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure',
    siteName: 'Nikhil Dodda Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nikhil Dodda - Applied AI Engineer',
    description: 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
