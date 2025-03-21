import { CheckCircle } from 'lucide-react'

interface UploadProgressProps {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
}

export const UploadProgress = ({ status, progress }: UploadProgressProps) => {
  if (status === 'idle') return null

  if (status === 'uploading') {
    return (
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Téléversement en cours...</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-muted dark:bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="mb-8 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg flex items-center gap-3">
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
        <div>
          <p className="font-medium text-green-700 dark:text-green-300">Document téléversé avec succès</p>
          <p className="text-sm text-green-600 dark:text-green-400">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    )
  }

  return null
}

export default UploadProgress