// src/app/page.tsx
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-6">
        Bienvenue chez Car Rental
      </h1>
      <p className="text-xl mb-8 max-w-2xl">
        Inscrivez-vous dès maintenant pour accéder à notre service de location de voitures. 
        Téléversez votre permis de conduire et commencez à louer des véhicules en quelques clics.
      </p>
      <div className="flex space-x-4">
        <Link href="/auth/register">
          <Button variant="primary" size="lg">
            S'inscrire
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="outline" size="lg">
            Se connecter
          </Button>
        </Link>
      </div>
      
      <div className="mt-12 p-6 bg-card rounded-lg shadow-md border border-border max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Comment ça fonctionne</h2>
        <ol className="text-left list-decimal list-inside space-y-2">
          <li>Inscrivez-vous avec votre email</li>
          <li>Connectez-vous à votre compte</li>
          <li>Téléversez votre permis de conduire</li>
          <li>Profitez de nos services de location</li>
        </ol>
      </div>
    </div>
  )
}