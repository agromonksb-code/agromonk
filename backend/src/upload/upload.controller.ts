import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }

  @Post('base64')
  async uploadBase64Image(@Body() body: { image: string; filename: string }) {
    const url = await this.uploadService.uploadBase64Image(body.image, body.filename);
    return { url };
  }
}
