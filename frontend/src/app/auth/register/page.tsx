'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, UserPlus, CheckCircle } from 'lucide-react'
import AuthLayout from '@/components/AuthElement/AuthLayout'
import AuthLink from '@/components/AuthElement/AuthLink'
import PasswordCriteria from '@/components/AuthElement/PasswordCriteria'
import SubmitButton from '@/components/AuthElement/SubmitButton'
import PasswordInput from '@/components/ui/PasswordInput'
import FormInput from '@/components/ui/FormInput'


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
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  })
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  
  // Observer la valeur du champ mot de passe
  const password = useWatch({
    control,
    name: 'password',
    defaultValue: ''
  })

  // Vérifier les critères de mot de passe à chaque changement
  useEffect(() => {
    setPasswordCriteria({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    })
  }, [password])

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
    <AuthLayout 
      title="Créez votre compte" 
      subtitle="Inscrivez-vous pour commencer à utiliser notre service"
      icon={<UserPlus className="h-8 w-8 text-white" />}
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
          <PasswordInput
            id="password"
            label="Mot de passe"
            placeholder="Créez un mot de passe"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordCriteria criteria={passwordCriteria} />
        </div>
        
        <PasswordInput
          id="confirmPassword"
          label="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          error={errors.confirmPassword?.message}
          icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />}
          {...register('confirmPassword')}
        />
        
        <SubmitButton
          isSubmitting={isSubmitting}
          loadingText="Inscription en cours..."
          text="S'inscrire"
        />
        
        <AuthLink
          text="Déjà inscrit ?"
          linkText="Connectez-vous"
          href="/auth/login"
        />
      </form>
    </AuthLayout>
  )
}