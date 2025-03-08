import { registerAs } from '@nestjs/config';

export default registerAs('goong', () => ({
  apiKey: process.env.GOONG_API_KEY,
  mapKey: process.env.GOONG_MAP_KEY,
  baseUrl: 'https://rsapi.goong.io',
}));
