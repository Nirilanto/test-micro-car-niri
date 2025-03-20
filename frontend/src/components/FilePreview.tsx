import { FileIcon, FileText } from 'lucide-react';
import Image from 'next/image';

interface FilePreviewProps {
  url: string;
  mimeType: string;
  fileName: string;
}

const FilePreview = ({ url, mimeType, fileName }: FilePreviewProps) => {
  if (mimeType === 'application/pdf') {
    return (
      <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
        <FileText size={24} className="text-red-500" />
      </div>
    );
  } else if (mimeType.startsWith('image/')) {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-border">
        <Image 
          src={url} 
          alt={fileName}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
    );
  } else {
    return (
      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
        <FileIcon size={24} className="text-muted-foreground" />
      </div>
    );
  }
};

export default FilePreview;