'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

// Schéma de validation
const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'
    )
    .required('Mot de passe requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requise'),
})

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
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
      const success = await registerUser(data.email, data.password)
      if (success) {
        toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.')
        router.push('/auth/login')
      } else {
        toast.error('Erreur lors de l\'inscription')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-card rounded-lg shadow-md overflow-hidden border border-border">
      <div className="py-4 px-6 bg-primary text-primary-foreground text-center">
        <h2 className="text-2xl font-bold">Inscription</h2>
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
        
        <div className="mb-4">
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
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-primary/30'
            }`}
            placeholder="Confirmez votre mot de passe"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">
            Déjà inscrit ?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}