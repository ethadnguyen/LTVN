import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  folder: 'assets', // thư mục mặc định để lưu ảnh
  allowedFormats: ['png', 'jpg', 'jpeg'],
  defaultOptions: {
    resource_type: 'auto',
    allowed_formats: ['png', 'jpg', 'jpeg'],
    // Có thể thêm các options mặc định khác ở đây
    // transformation: [...],
    // format: '...',
  },
}));
