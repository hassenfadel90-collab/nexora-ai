import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'NEXORA AI — Software, AI & Automation',
  description: 'NEXORA builds premium software, AI systems, automation and digital platforms for modern businesses.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
