// libs/common/src/interfaces/file.interface.ts
export interface IFile {
    id: string;
    userId: string;
    originalName: string;
    filename: string;
    mimeType: string;
    size: number;
    s3Key: string;
    s3Url?: string;
    uploadedAt: Date;
  }