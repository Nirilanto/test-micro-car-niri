// src/hooks/useFormError.ts
'use client'

import { FieldError } from 'react-hook-form'

export function useFormError(error?: FieldError) {
  if (!error) {
    return {
      hasError: false,
      errorMessage: null,
      inputClass: 'border-border focus:ring-primary/30'
    }
  }
  
  return {
    hasError: true,
    errorMessage: error.message,
    inputClass: 'border-red-500 focus:ring-red-200'
  }
}