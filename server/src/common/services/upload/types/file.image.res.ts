import { ApiProperty } from '@nestjs/swagger';

export class FileInfo {
  @ApiProperty()
  originalname: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  public_id: string;
}

export class FileImageRes {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: [FileInfo] })
  files: FileInfo[];
}

export interface SingleImageResponse {
  success: boolean;
  message: string;
  image: {
    url: string;
  };
}

export interface MultipleImageResponse {
  success: boolean;
  message: string;
  images: {
    urls: string[];
  };
}
