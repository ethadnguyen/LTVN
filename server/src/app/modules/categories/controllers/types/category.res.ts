import { ApiProperty } from '@nestjs/swagger';

export class CategoryRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  icon: string;
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ required: false })
  parent?: CategoryRes;

  @ApiProperty({ type: [CategoryRes], required: false })
  children?: CategoryRes[];
}
