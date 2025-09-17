import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
                if (shouldBeDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}