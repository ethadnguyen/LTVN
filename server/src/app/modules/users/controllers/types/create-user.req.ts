import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { StatusUser } from 'src/common/enum/user.enum';

export class CreateUserReq {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum([StatusUser.ENABLE, StatusUser.DISABLE])
  status: StatusUser;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
