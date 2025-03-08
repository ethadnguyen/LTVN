import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { StatusUser } from 'src/common/enum/user.enum';

export class UpdateUserReq {
  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  user_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum([StatusUser.ENABLE, StatusUser.DISABLE])
  status?: StatusUser;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
