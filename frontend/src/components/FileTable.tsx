'use client'

import { Eye, FileIcon, Trash2 } from 'lucide-react';
import FilePreview from './FilePreview';
import Swal from 'sweetalert2';

interface File {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface FileTableProps {
  files: File[];
  animatedItems: boolean;
  onDelete: (id: string) => Promise<void>;
}

const FileTable = ({ files, animatedItems, onDelete }: FileTableProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileTypeIcon = (mimeType: string) => {
    return mimeType === 'application/pdf' 
      ? <FileIcon className="inline-block mr-1 text-red-500" size={16} /> 
      : <FileIcon className="inline-block mr-1 text-blue-500" size={16} />;
  };

  const handleDeleteFile = async (id: string, fileName: string) => {
    // Utilisation de SweetAlert2 pour la confirmation
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      html: `Vous êtes sur le point de supprimer <strong>${fileName}</strong>.<br>Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
    });

    if (result.isConfirmed) {
      try {
        await onDelete(id);
        
        Swal.fire({
          title: 'Supprimé !',
          text: 'Le fichier a été supprimé avec succès.',
          icon: 'success',
          background: 'rgb(var(--card))',
          color: 'rgb(var(--card-foreground))',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-muted-foreground">Aperçu</th>
              <th className="px-6 py-4 text-left font-bold text-muted-foreground">Nom du fichier</th>
              <th className="px-6 py-4 text-left font-bold text-muted-foreground">Type</th>
              <th className="px-6 py-4 text-left font-bold text-muted-foreground">Taille</th>
              <th className="px-6 py-4 text-left font-bold text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-left font-bold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {files.map((file, index) => (
              <tr 
                key={file.id} 
                className={`hover:bg-muted/30 transition-colors duration-150 
                ${animatedItems ? 'animate-in fade-in slide-in-from-bottom-3' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
              >
                <td className="px-6 py-4">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <FilePreview 
                      url={file.url} 
                      mimeType={file.mimeType} 
                      fileName={file.originalName} 
                    />
                  </a>
                </td>
                <td className="px-6 py-4 font-medium">{file.originalName}</td>
                <td className="px-6 py-8 flex items-center justify-center">
                  {getFileTypeIcon(file.mimeType)}
                  <span>{file.mimeType === 'application/pdf' ? 'PDF' : 'IMG'}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{formatFileSize(file.size)}</td>
                <td className="px-6 py-4 text-muted-foreground">{formatDate(file.uploadedAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <a 
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors duration-200 p-2 rounded-full hover:bg-primary/10 flex items-center"
                      title="Voir le document"
                    >
                      <Eye size={18} />
                    </a>
                    <button
                      onClick={() => handleDeleteFile(file.id, file.originalName)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center"
                      title="Supprimer le document"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;