import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewReq {
  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  product_id: number;

  @ApiProperty()
  user_id: number;
}
