import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { vietnamProvinces } from '../data/vietnam-provinces';
import { vietnamDistricts } from '../data/vietnam-districts';
import { vietnamWards } from '../data/vietnam-wards';
import { Province, District, Ward } from '../interfaces/address.interface';

@Injectable()
export class GoongService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey =
      process.env.GOONG_API_KEY ||
      this.configService.get<string>('goong.apiKey');
    this.baseUrl =
      process.env.GOONG_BASE_URL ||
      this.configService.get<string>('goong.baseUrl') ||
      'https://rsapi.goong.io';

    if (!this.apiKey) {
      console.error('GOONG_API_KEY is not configured in environment variables');
    }

    console.log('Goong Config:', {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
    });
  }

  async searchPlaces(keyword: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/Place/AutoComplete`, {
        params: {
          api_key: this.apiKey,
          input: keyword,
        },
      });
      return response.data.predictions;
    } catch (error) {
      throw new HttpException('Failed to search places', 500);
    }
  }

  async getPlaceDetail(placeId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/Place/Detail`, {
        params: {
          api_key: this.apiKey,
          place_id: placeId,
        },
      });
      return response.data.result;
    } catch (error) {
      throw new HttpException('Failed to get place detail', 500);
    }
  }

  async geocode(address: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/Geocode`, {
        params: {
          api_key: this.apiKey,
          address: address,
        },
      });
      return response.data.results[0];
    } catch (error) {
      throw new HttpException('Failed to geocode address', 500);
    }
  }

  async getProvinces() {
    try {
      return Object.values(vietnamProvinces[0]).map((province: Province) => ({
        code: province.code,
        name: province.name_with_type,
      }));
    } catch (error) {
      throw new HttpException('Failed to get provinces', 500);
    }
  }

  async getDistricts(provinceCode: string) {
    try {
      return Object.values(vietnamDistricts[0])
        .filter((district: District) => district.parent_code === provinceCode)
        .map((district) => ({
          code: district.code,
          name: district.name_with_type,
        }));
    } catch (error) {
      throw new HttpException('Failed to get districts', 500);
    }
  }

  async getWards(districtCode: string) {
    try {
      return Object.values(vietnamWards[0])
        .filter((ward: Ward) => ward.parent_code === districtCode)
        .map((ward) => ({
          code: ward.code,
          name: ward.name_with_type,
        }));
    } catch (error) {
      throw new HttpException('Failed to get wards', 500);
    }
  }
}
