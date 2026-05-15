import type { Metadata } from 'next'
import localFont from 'next/font/local'
import AuthBootstrap from '@/components/providers/AuthBootstrap'
import ThemeProvider from '@/components/providers/ThemeProvider'
import './globals.css'

const sarabun = localFont({
  variable: '--font-sarabun',
  src: [
    {
      path: '../../public/fonts/sarabun-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sarabun-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = {
  title: 'InvoiceFlow',
  description: 'Invoice & Payment Tracker for freelancers and SMEs',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${sarabun.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthBootstrap>{children}</AuthBootstrap>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
