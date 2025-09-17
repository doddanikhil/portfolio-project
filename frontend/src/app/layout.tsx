import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

// Use system fonts for better reliability
const fontClassName = 'font-sans';

export const metadata: Metadata = {
  title: 'Nikhil Dodda - Applied AI Engineer',
  description: 'Applied AI Engineer specializing in production LLM systems and scalable cloud infrastructure. Building intelligent applications that solve real business problems.',
  keywords: 'AI Engineer, Machine Learning, LLM, RAG, Python, AWS, Software Engineering',
  authors: [{ name: 'Nikhil Dodda' }],
  creator: 'Nikhil Dodda',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nikhildodda.dev',
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add when you get one
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fontClassName} bg-slate-900 min-h-screen`}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}