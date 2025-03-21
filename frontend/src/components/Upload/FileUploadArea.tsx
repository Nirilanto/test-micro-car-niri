'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FileUploadAreaProps {
    onFileChange: (file: File | null) => void
    fileError: string | null
    setFileError: (error: string | null) => void
    acceptedFileTypes?: string
    maxSizeInBytes?: number
    validateFile?: (file: File) => boolean
}

export const FileUploadArea = ({
    onFileChange,
    fileError,
    setFileError,
    acceptedFileTypes = '.pdf,.jpg,.jpeg',
    maxSizeInBytes = 5 * 1024 * 1024, // 5MB par défaut
    validateFile
}: FileUploadAreaProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Créer l'URL de prévisualisation quand un fichier est sélectionné
    useEffect(() => {
        if (file && file.type.includes('image')) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)

            // Nettoyer l'URL quand le composant est démonté ou quand le fichier change
            return () => {
                URL.revokeObjectURL(url)
                setPreviewUrl(null)
            }
        }
    }, [file])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null)
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]

            if (validateFile) {
                if (validateFile(selectedFile)) {
                    setFile(selectedFile)
                    onFileChange(selectedFile)
                }
            } else {
                if (defaultValidateFile(selectedFile)) {
                    setFile(selectedFile)
                    onFileChange(selectedFile)
                }
            }
        }
    }

    const defaultValidateFile = (file: File): boolean => {
        // Vérifier le type de fichier
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg']
        if (!validTypes.includes(file.type)) {
            setFileError('Format de fichier non supporté. Seuls les formats PDF et JPEG sont acceptés.')
            return false
        }

        // Vérifier la taille du fichier
        if (file.size > maxSizeInBytes) {
            setFileError(`La taille du fichier dépasse la limite autorisée de ${formatFileSize(maxSizeInBytes)}.`)
            return false
        }

        return true
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
            const droppedFile = e.dataTransfer.files[0]

            if (validateFile) {
                if (validateFile(droppedFile)) {
                    setFile(droppedFile)
                    onFileChange(droppedFile)
                }
            } else {
                if (defaultValidateFile(droppedFile)) {
                    setFile(droppedFile)
                    onFileChange(droppedFile)
                }
            }
        }
    }, [onFileChange, setFileError, validateFile])

    const resetFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }

        setFile(null)
        onFileChange(null)
        setFileError(null)
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
        <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 scale-[1.02]'
                    : fileError
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                        : file
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                            : 'border-border bg-background'
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
                accept={acceptedFileTypes}
                onChange={handleFileChange}
            />

            {file ? (
                <div className="flex flex-col items-center">
                    <div className="relative">
                        {file.type.includes('image') ? (
                            <div className="mt-4">
                                <div className="relative w-64 h-40 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-border">
                                    {previewUrl && <img
                                        src={previewUrl}
                                        alt="Aperçu"
                                        className="w-full h-full object-contain"
                                    />}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 dark:bg-red-900/10 mt-4 w-64 h-40 flex items-center justify-center rounded-lg border border-border">
                                <div className="text-center p-4">
                                    <p className="font-medium text-red-600 dark:text-red-400">Document PDF</p>
                                    <p className="text-sm text-red-500 dark:text-red-300 mt-1">Aperçu non disponible</p>
                                </div>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={resetFile}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <p className="text-lg font-medium mt-4 mb-2">Fichier sélectionné</p>
                    <div className="bg-background px-4 py-2 rounded-lg mb-4 max-w-full w-full md:w-96 border border-border">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>{file.type.split('/')[1].toUpperCase()}</span>
                            <span>{formatFileSize(file.size)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className={`p-5 rounded-full mb-4 ${fileError ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                        {fileError ? (
                            <AlertCircle className="h-10 w-10 text-red-500" />
                        ) : (
                            <Upload className="h-10 w-10 text-blue-500" />
                        )}
                    </div>
                    <p className="text-lg font-medium mb-2">
                        {fileError ? 'Erreur de fichier' : 'Glissez et déposez votre fichier ici'}
                    </p>
                    {fileError ? (
                        <p className="text-sm text-red-500 mb-4 max-w-md">{fileError}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground mb-4">
                            ou cliquez pour sélectionner un fichier
                        </p>
                    )}
                    <Button
                        type="button"
                        variant={fileError ? "primary" : "outline"}
                        onClick={() => fileInputRef.current?.click()}
                        className={fileError ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                        {fileError ? 'Sélectionner un autre fichier' : 'Parcourir'}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default FileUploadArea