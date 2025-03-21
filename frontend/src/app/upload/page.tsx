'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { fileService } from '@/lib/api'
import { AlertCircle } from 'lucide-react'
import ActionButtons from '@/components/Upload/ActionButtons'
import FileUploadArea from '@/components/Upload/FileUploadArea'
import InfoNotes from '@/components/Upload/InfoNotes'
import PageHeader from '@/components/Upload/PageHeader'
import UploadProgress from '@/components/Upload/UploadProgress'


export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
  }

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
      setUploadStatus('error')
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('uploading')

    try {
      // Simuler la progression de téléversement
      const progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval)
            return prevProgress
          }
          return prevProgress + 5
        })
      }, 200)

      // Utiliser le service pour téléverser le fichier
      await fileService.uploadFile(file)
      
      // Progression complète
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus('success')

      toast.success('Document téléversé avec succès')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500) // Petit délai pour montrer l'animation de succès
    } catch (error) {
      let errorMessage = 'Erreur lors du téléversement du fichier'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      setFileError(errorMessage)
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const infoItems = [
    { text: "Nous n'acceptons que les formats PDF et JPEG." },
    { text: "La taille maximale du fichier est de 5 MB." },
    { text: "Assurez-vous que votre document est lisible et non endommagé." },
    { text: "Nous respectons la confidentialité de vos documents." }
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        title="Téléverser votre permis de conduire"
        onBack={() => router.push('/dashboard')}
      />
      
      <div className="bg-card rounded-xl shadow-md border border-border p-8">
        <form onSubmit={handleSubmit}>
          <FileUploadArea
            onFileChange={handleFileChange}
            fileError={fileError}
            setFileError={setFileError}
            validateFile={validateFile}
          />
          
          <div className="mt-8">
            <UploadProgress 
              status={uploadStatus} 
              progress={uploadProgress} 
            />
            
            <ActionButtons
              onCancel={() => router.push('/dashboard')}
              isSubmitting={isUploading}
              isDisabled={!file || !!fileError}
            />
          </div>
        </form>
      </div>
      
      <div className="mt-8">
        <InfoNotes
          title="Notes importantes"
          icon={<AlertCircle className="h-5 w-5 text-blue-500" />}
          items={infoItems}
          variant="info"
        />
      </div>
    </div>
  )
}