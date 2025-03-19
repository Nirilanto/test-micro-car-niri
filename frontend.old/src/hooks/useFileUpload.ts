// src/hooks/useFileUpload.ts
'use client'

import { useState } from 'react'
import axios from 'axios'

interface UploadOptions {
  url: string
  fileType?: 'pdf' | 'image' | 'all'
  maxSizeInMB?: number
  onSuccess?: (response: any) => void
  onError?: (error: Error) => void
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const validateFile = (file: File, options: UploadOptions) => {
    // Vérification de la taille du fichier
    const maxSizeInBytes = (options.maxSizeInMB || 5) * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      throw new Error(`La taille du fichier ne doit pas dépasser ${options.maxSizeInMB || 5}MB`)
    }
    
    // Vérification du type de fichier
    if (options.fileType === 'pdf' && file.type !== 'application/pdf') {
      throw new Error('Seuls les fichiers PDF sont acceptés')
    }
    
    if (options.fileType === 'image' && !file.type.startsWith('image/')) {
      throw new Error('Seules les images sont acceptées')
    }
    
    if (options.fileType === 'all' || !options.fileType) {
      // On accepte tous les types, mais pour ce projet spécifique on peut limiter à PDF et JPEG
      if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        throw new Error('Seuls les fichiers PDF et JPEG sont acceptés')
      }
    }
  }
  
  const uploadFile = async (file: File, options: UploadOptions) => {
    setIsUploading(true)
    setProgress(0)
    setError(null)
    
    try {
      // Valider le fichier
      validateFile(file, options)
      
      // Créer un FormData
      const formData = new FormData()
      formData.append('file', file)
      
      // Envoyer le fichier
      const response = await axios.post(options.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          )
          setProgress(percentCompleted)
        },
      })
      
      // En cas de succès
      if (options.onSuccess) {
        options.onSuccess(response.data)
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      
      if (options.onError && err instanceof Error) {
        options.onError(err)
      }
      
      throw err
    } finally {
      setIsUploading(false)
    }
  }
  
  return {
    uploadFile,
    isUploading,
    progress,
    error,
  }
}