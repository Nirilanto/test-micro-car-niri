// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Lock } from 'lucide-react'

import AuthLayout from '@/components/AuthElement/AuthLayout'
import AuthLink from '@/components/AuthElement/AuthLink'
import SubmitButton from '@/components/AuthElement/SubmitButton'
import PasswordInput from '@/components/ui/PasswordInput'
import FormInput from '@/components/ui/FormInput'


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
    <AuthLayout 
      title="Bienvenue" 
      subtitle="Connectez-vous pour accéder à votre compte"
      icon={<User className="h-8 w-8 text-white" />}
    >
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <FormInput
          id="email"
          label="Email"
          type="email"
          icon={<Mail className="h-5 w-5 text-muted-foreground" />}
          placeholder="Votre email"
          error={errors.email?.message}
          {...register('email')}
        />
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block font-medium text-foreground">
              Mot de passe
            </label>
            <a 
              href="/auth/forgot-password" 
              className="text-sm text-blue-500 hover:text-purple-500 transition-colors hover:underline"
            >
              Mot de passe oublié?
            </a>
          </div>
          <PasswordInput
            id="password"
            label=""
            placeholder="Votre mot de passe"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>
        
        <SubmitButton
          isSubmitting={isSubmitting}
          loadingText="Connexion en cours..."
          text="Se connecter"
        />
        
        <AuthLink
          text="Pas encore inscrit ?"
          linkText="Créer un compte"
          href="/auth/register"
        />
      </form>
    </AuthLayout>
  )
}