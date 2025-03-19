'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { fileService } from '@/lib/api'

export default function Upload() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setFileError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const validateFile = (file: File): boolean => {
    // Vérifier le type de fichier
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setFileError('Format de fichier non supporté. Seuls les formats PDF et JPEG sont acceptés.')
      return false
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError('La taille du fichier dépasse la limite autorisée de 5MB.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFileError(null)

    if (!file) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }

    if (!validateFile(file)) {
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simuler la progression de téléversement (comme nous n'avons pas d'accès direct aux événements de progression avec fileService)
      const progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval)
            return prevProgress
          }
          return prevProgress + 10
        })
      }, 300)

      // Utiliser le service pour téléverser le fichier
      await fileService.uploadFile(file)
      
      // Progression complète
      clearInterval(progressInterval)
      setUploadProgress(100)

      toast.success('Document téléversé avec succès')
      setTimeout(() => {
        router.push('/dashboard')
      }, 500) // Petit délai pour montrer le 100%
    } catch (error) {
      let errorMessage = 'Erreur lors du téléversement du fichier'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      setFileError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const resetFile = () => {
    setFile(null)
    setFileError(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (size: number): string => {
    if (size < 1024) return size + ' B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Téléverser votre permis de conduire</h1>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : fileError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-border bg-background'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium mb-2">Fichier sélectionné:</p>
                <p className="mb-1 max-w-full truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {file.type.split('/')[1].toUpperCase()} - {formatFileSize(file.size)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFile}
                  size="sm"
                >
                  Changer de fichier
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg 
                  className={`h-16 w-16 mb-4 ${fileError ? 'text-red-500' : 'text-muted-foreground'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium mb-2">
                  {fileError ? 'Erreur de fichier' : 'Glissez et déposez votre fichier ici'}
                </p>
                {fileError ? (
                  <p className="text-sm text-red-500 mb-4">{fileError}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    ou cliquez pour sélectionner un fichier
                  </p>
                )}
                <Button
                  type="button"
                  variant={fileError ? "primary" : "outline"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {fileError ? 'Sélectionner un autre fichier' : 'Parcourir'}
                </Button>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="mb-6">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-center mt-2">{uploadProgress}% téléversé</p>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!file || isUploading || !!fileError}
            >
              {isUploading ? 'Téléversement en cours...' : 'Téléverser'}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
        <h2 className="font-semibold mb-2">Notes importantes:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Nous n'acceptons que les formats PDF et JPEG.</li>
          <li>La taille maximale du fichier est de 5 MB.</li>
          <li>Assurez-vous que votre document est lisible et non endommagé.</li>
          <li>Nous respectons la confidentialité de vos documents.</li>
        </ul>
      </div>
    </div>
  )
}