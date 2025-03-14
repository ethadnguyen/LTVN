import { IsString, IsOptional } from 'class-validator';

export class VnPayCallbackDto {
  @IsString()
  vnp_ResponseCode: string;

  @IsString()
  vnp_TransactionNo: string;

  @IsString()
  vnp_Amount: string;

  @IsString()
  vnp_OrderInfo: string;

  @IsString()
  vnp_PayDate: string;

  @IsString()
  @IsOptional()
  vnp_BankCode?: string;

  @IsString()
  @IsOptional()
  vnp_CardType?: string;

  @IsString()
  vnp_TxnRef: string;

  @IsString()
  vnp_SecureHash: string;
}
