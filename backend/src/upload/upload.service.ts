import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Ensure uploads directory exists
    if (!existsSync(this.uploadPath)) {
      await mkdir(this.uploadPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const filepath = join(this.uploadPath, filename);

    // Save file
    await writeFile(filepath, file.buffer);

    // Return public URL
    return `/uploads/${filename}`;
  }

  async uploadBase64Image(base64Data: string, filename: string): Promise<string> {
    // Ensure uploads directory exists
    if (!existsSync(this.uploadPath)) {
      await mkdir(this.uploadPath, { recursive: true });
    }

    // Remove data URL prefix
    const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = filename.split('.').pop() || 'png';
    const uniqueFilename = `${timestamp}-${filename}`;
    const filepath = join(this.uploadPath, uniqueFilename);

    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64, 'base64');
    await writeFile(filepath, buffer);

    // Return public URL
    return `/uploads/${uniqueFilename}`;
  }
}
