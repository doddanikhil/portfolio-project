// frontend/src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nikhil - Applied AI Engineer',
  description: 'Applied AI Engineer specializing in LLM systems, RAG, and production ML applications.',
  keywords: 'AI Engineer, Machine Learning, LLM, RAG, Python, AWS, Next.js, Django',
  authors: [{ name: 'Nikhil' }],
  creator: 'Nikhil',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Nikhil - Applied AI Engineer',
    description: 'Applied AI Engineer specializing in LLM systems, RAG, and production ML applications.',
    siteName: 'Nikhil Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nikhil - Applied AI Engineer',
    description: 'Applied AI Engineer specializing in LLM systems, RAG, and production ML applications.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}