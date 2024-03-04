import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { NextAuthProvider } from '@/providers/NextAuthProvider'

import styles from './layout.module.scss'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

import '../../styles/global.scss'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'CliniMed Center',
  description: 'Clínica CliniMed - Você em primeiro lugar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={roboto.className}>
          <Header />
          <div className={styles.container}>{children}</div>
          <Footer />
        </body>
      </NextAuthProvider>
    </html>
  )
}
