// libs/common/src/dto/file/file-response.dto.ts
export class FileResponseDto {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: Date;
  }