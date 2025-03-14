import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repositories';
import { GoongService } from './goong.service';
import { Address } from '../entities/address.entity';
import { GetAllAddressInput } from './types/get.all.address.input';
import { CreateAddressInput } from './types/create-address.input';
import { LabelType } from '../enums/label-type.enum';
import { UpdateAddressInput } from './types/update-address.input';
import { UserRepository } from '../../users/repositories/user.repositories';
import { OrderRepository } from '../../orders/repositories/order.repositories';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly goongService: GoongService,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly jwtService: JwtService,
  ) {}

  getUserIdFromToken(authorization: string): number {
    try {
      if (!authorization) {
        throw new UnauthorizedException('Không có token');
      }

      const token = authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token);
      return decodedToken.user_id;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  async getAllAddresses(queryParams: GetAllAddressInput) {
    const { page = 1, size = 10, user_id, order_id } = queryParams;

    const [addresses, total] = await this.addressRepository.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      user_id,
      order_id,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      addresses,
    };
  }

  async searchAddress(keyword: string) {
    return this.goongService.searchPlaces(keyword);
  }

  async createAddressFromGoong(input: CreateAddressInput) {
    const placeDetail = await this.goongService.getPlaceDetail(input.place_id);

    const address = new Address();
    address.label = input.label || LabelType.HOME;
    address.street = placeDetail.street || input.street || '';
    address.note = input.note || '';
    address.province = input.province || '';
    address.district = input.district || '';
    address.ward = input.ward || '';
    address.place_id = input.place_id;
    address.user = await this.userRepository.findById(input.user_id);

    if (input.order_id) {
      address.order = await this.orderRepository.findById(input.order_id);
    }

    return this.addressRepository.create(address);
  }

  async updateAddress(input: UpdateAddressInput) {
    const placeDetail = await this.goongService.getPlaceDetail(input.place_id);

    return this.addressRepository.update(input.id, {
      label: input.label || '',
      street: placeDetail.street || input.street || '',
      province: input.province || '',
      district: input.district || '',
      ward: input.ward || '',
      place_id: input.place_id,
      note: input.note,
    });
  }

  async getProvinces() {
    return this.goongService.getProvinces();
  }

  async getDistricts(provinceId: string) {
    return this.goongService.getDistricts(provinceId);
  }

  async getWards(districtId: string) {
    return this.goongService.getWards(districtId);
  }

  async suggestAddress(
    province: string,
    district: string,
    ward: string,
    keyword: string,
  ) {
    const searchQuery = `${keyword}, ${ward}, ${district}, ${province}`;
    return this.goongService.searchPlaces(searchQuery);
  }

  async deleteAddress(id: number) {
    return this.addressRepository.delete(id);
  }
}
