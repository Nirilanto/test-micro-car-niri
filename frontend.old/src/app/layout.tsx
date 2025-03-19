// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car Rental - Location de voitures',
  description: 'Système de location de voitures avec téléversement de permis de conduire',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="bg-card text-card-foreground py-4">
                <div className="container mx-auto px-4 text-center">
                  © {new Date().getFullYear()} Car Rental. Tous droits réservés.
                </div>
              </footer>
              <ToastContainer position="bottom-right" theme="colored" />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}