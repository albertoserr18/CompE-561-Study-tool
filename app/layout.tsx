import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'COMPE 561 Final Study App',
  description: 'Study tool for COMPE 561 final exam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

