import { Metadata } from 'next'
import Image from 'next/image'
import { Roboto } from 'next/font/google'

import { NextAuthProvider } from '@/providers/NextAuthProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import { Toast } from '@/components/Toast/Toast'
import { ToastHandler } from '@/components/Toast/ToastHandler'

import '../../styles/global.scss'
import styles from './layout.module.scss'

import HomeBackground from '@/../public/home-background.jpg'

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
        <body className={`${roboto.className}`}>
          <Header />
          <div className={styles.container}>
            <ToastHandler />
            <div className={styles.imageContainer}>
              <h1>CliniMed Center</h1>
              <Image
                src={HomeBackground}
                alt="Imagem do consultório"
                fill={true}
              />
            </div>
            <section className={styles.sectionContainer}>{children}</section>
            <Toast />
          </div>

          <Footer />
        </body>
      </NextAuthProvider>
    </html>
  )
}
