// file-service/src/uploads/entities/file.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  originalName: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  s3Key: string;

  @Column({ nullable: true })
  s3Url: string;

  @CreateDateColumn()
  uploadedAt: Date;
}