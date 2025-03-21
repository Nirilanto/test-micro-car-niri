import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import ClientProviders from '@/components/ClientProviders'
import Header from '@/components/Header/Header'

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
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-card text-card-foreground py-4">
              <p className="flex items-center justify-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                © {new Date().getFullYear()} Car Rental. Tous droits réservés.
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              </p>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
