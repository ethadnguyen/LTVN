import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repositories';
import { GoongService } from './goong.service';
import { Address } from '../entities/address.entity';
import { GetAllAddressInput } from './types/get.all.address.input';
import { CreateAddressInput } from './types/create-address.input';
import { LabelType } from '../enums/label-type.enum';
import { UpdateAddressInput } from './types/update-address.input';
import { UserRepository } from '../../users/repositories/user.repositories';
import { OrderRepository } from '../../orders/repositories/order.repositories';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly goongService: GoongService,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

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
    address.label = placeDetail.name || LabelType.HOME;
    address.street = placeDetail.street;
    address.note = input.note;
    address.province = placeDetail.province;
    address.district = placeDetail.district;
    address.ward = placeDetail.ward;
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
      label: placeDetail.name,
      street: placeDetail.street,
      province: placeDetail.province,
      district: placeDetail.district,
      ward: placeDetail.ward,
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
}
