// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

// Schéma de validation
const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().required('Mot de passe requis'),
})

type FormData = {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('from') || '/dashboard'
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        toast.success('Connexion réussie !')
        router.push(redirectPath)
      } else {
        toast.error('Email ou mot de passe invalide')
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-card rounded-lg shadow-md overflow-hidden border border-border">
      <div className="py-4 px-6 bg-primary text-primary-foreground text-center">
        <h2 className="text-2xl font-bold">Connexion</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="py-4 px-6">
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring ${
              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-primary/30'
            }`}
            placeholder="Votre email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block font-medium mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring ${
              errors.password ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-primary/30'
            }`}
            placeholder="Votre mot de passe"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">
            Pas encore inscrit ?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}