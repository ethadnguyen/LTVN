import { ApiProperty } from '@nestjs/swagger';
import { OrderRes } from 'src/app/modules/orders/controllers/types/order.res';
import { UserRes } from 'src/app/modules/users/controllers/types/user.res';

export class AddressRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  ward: string;

  @ApiProperty()
  user: UserRes;

  @ApiProperty()
  order: OrderRes;

  @ApiProperty()
  created_at: Date;
}
