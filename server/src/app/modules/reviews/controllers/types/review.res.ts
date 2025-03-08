import { ApiProperty } from '@nestjs/swagger';
import { ProductRes } from 'src/app/modules/products/controllers/types/product.res';
import { UserRes } from 'src/app/modules/users/controllers/types/user.res';

export class ReviewRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserRes;

  @ApiProperty()
  product: ProductRes;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
