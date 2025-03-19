'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'

interface File {
  id: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/api/files')
        setFiles(response.data)
      } catch (error) {
        console.error('Error fetching files:', error)
        toast.error('Erreur lors du chargement des fichiers')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const handleDeleteFile = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      return
    }

    try {
      await axios.delete(`/api/files/${id}`)
      setFiles(files.filter(file => file.id !== id))
      toast.success('Fichier supprimé avec succès')
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Erreur lors de la suppression du fichier')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Link href="/upload">
          <Button variant="primary">
            Déposer un nouveau document
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Chargement de vos documents...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Aucun document trouvé</h2>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas encore téléversé de permis de conduire.
          </p>
          <Link href="/upload">
            <Button variant="primary">
              Téléverser un document
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Nom du fichier</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Taille</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{file.originalName}</td>
                    <td className="px-4 py-3">
                      {file.mimeType === 'application/pdf' ? 'PDF' : 'Image'}
                    </td>
                    <td className="px-4 py-3">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3">{formatDate(file.uploadedAt)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <a 
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        Voir
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700 ml-3"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}