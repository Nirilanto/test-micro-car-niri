'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import { fileService } from '@/lib/api'
import { FileUp } from 'lucide-react'
import FileTable from '@/components/FileTable/FileTable'
import EmptyState from '@/components/EmptyState'
import LoadingState from '@/components/LoadingState'

interface File {
  id: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
}

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [animatedItems, setAnimatedItems] = useState<boolean>(false)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fileService.getFiles()
        setFiles(response)
        // Déclenchement de l'animation après le chargement
        setTimeout(() => setAnimatedItems(true), 100)
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
    try {
      await fileService.deleteFile(id)
      setFiles(files.filter(file => file.id !== id))
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Erreur lors de la suppression du fichier')
      throw error
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 transition-all duration-300 ease-in-out">
      {loading ? (
        <LoadingState />
      ) : files.length === 0 ? (
        <EmptyState />
      ) : (
        <FileTable
          files={files}
          animatedItems={animatedItems}
          onDelete={handleDeleteFile}
        />
      )}
      <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-5 duration-500">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <Link href="/upload">
          <Button variant="primary" className="transition-all duration-300 hover:shadow-lg flex items-center gap-2 px-4 py-2">
            <FileUp size={18} />
            <span>Déposer un document</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}