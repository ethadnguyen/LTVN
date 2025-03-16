import { registerAs } from '@nestjs/config';

export default registerAs('payos', () => ({
  baseUrl: process.env.PAYOS_BASE_URL,
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
  returnUrl: process.env.PAYMENT_RETURN_URL,
  cancelUrl: process.env.PAYMENT_CANCEL_URL,
}));
