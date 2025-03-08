import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Put,
  Param,
  HttpCode,
} from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllAddressReq } from './types/get.all.address.req';
import { CreateAddressReq } from './types/create-address.req';
import { AddressRes } from './types/address.res';
import { UpdateAddressReq } from './types/update-address.req';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Public()
  @Get('all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all addresses',
    type: AddressRes,
  })
  async getAllAddresses(@Query() queryParams: GetAllAddressReq) {
    return this.addressService.getAllAddresses(queryParams);
  }

  @Public()
  @Get('search')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Search addresses using Goong API',
    type: AddressRes,
  })
  async searchAddress(@Query('keyword') keyword: string) {
    return this.addressService.searchAddress(keyword);
  }

  @Public()
  @Post('')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create address from Goong place_id',
    type: AddressRes,
  })
  async createAddress(@Body() body: CreateAddressReq) {
    return this.addressService.createAddressFromGoong(body);
  }

  @Put('/update')
  @ApiResponse({
    status: 200,
    description: 'Update address',
  })
  async updateAddress(@Body() body: UpdateAddressReq) {
    return this.addressService.updateAddress(body);
  }

  @Public()
  @Get('provinces')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all provinces',
  })
  async getProvinces() {
    return this.addressService.getProvinces();
  }

  @Public()
  @Get('districts/:provinceCode')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get districts by province',
  })
  async getDistricts(@Param('provinceCode') provinceCode: string) {
    return this.addressService.getDistricts(provinceCode);
  }

  @Public()
  @Get('wards/:districtCode')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get wards by district',
  })
  async getWards(@Param('districtCode') districtCode: string) {
    return this.addressService.getWards(districtCode);
  }

  @Public()
  @Get('suggest')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Suggest addresses based on selected location',
  })
  async suggestAddress(
    @Query('province') province: string,
    @Query('district') district: string,
    @Query('ward') ward: string,
    @Query('keyword') keyword: string,
  ) {
    return this.addressService.suggestAddress(
      province,
      district,
      ward,
      keyword,
    );
  }
}
