import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly allowedFormats: string[];

  constructor(private configService: ConfigService) {
    // Lấy config từ ConfigService
    const cloudinaryConfig = this.configService.get('cloudinary');

    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
    });

    this.allowedFormats = cloudinaryConfig.allowedFormats;
  }

  private validateFileFormat(mimetype: string): void {
    const format = mimetype.split('/')[1];
    if (!this.allowedFormats.includes(format)) {
      throw new BadRequestException(
        `Định dạng file không được hỗ trợ. Các định dạng được chấp nhận: ${this.allowedFormats.join(', ')}`,
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      this.validateFileFormat(file.mimetype);

      // Convert buffer thành base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const cloudinaryConfig = this.configService.get('cloudinary');

      // Upload lên Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        ...cloudinaryConfig.defaultOptions,
        folder: cloudinaryConfig.folder,
      });

      return result.secure_url;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      // Validate tất cả các file trước khi upload
      files.forEach((file) => this.validateFileFormat(file.mimetype));

      const uploadPromises = files.map((file) => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}
