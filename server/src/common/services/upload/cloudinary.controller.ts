import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('upload')
@ApiTags('Upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        exceptionFactory: (error) => {
          throw new BadRequestException(
            'Chỉ chấp nhận file có định dạng jpg, jpeg hoặc png',
          );
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      return {
        success: true,
        message: 'Upload ảnh thành công',
        image: { url: imageUrl },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        exceptionFactory: (error) => {
          throw new BadRequestException(
            'Chỉ chấp nhận file có định dạng jpg, jpeg hoặc png',
          );
        },
      }),
    )
    files: Express.Multer.File[],
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('Không có file nào được gửi lên');
      }

      const imageUrls =
        await this.cloudinaryService.uploadMultipleImages(files);
      return {
        success: true,
        message: 'Upload ảnh thành công',
        images: { urls: imageUrls },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('delete')
  async deleteFile(@UploadedFile('publicId') publicId: string) {
    try {
      await this.cloudinaryService.deleteImage(publicId);
      return {
        success: true,
        message: 'Xóa ảnh thành công',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
