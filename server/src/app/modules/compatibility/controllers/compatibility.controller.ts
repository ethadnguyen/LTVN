import { Body, Controller, Post } from '@nestjs/common';
import {
  CompatibilityReq,
  CompatibilityByIdReq,
  CompatibilityByProductIdsReq,
} from './types/compatibility.req';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompatibilityService } from '../services/compatibility.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Compatibility')
@Public()
@Controller('compatibility')
@ApiBearerAuth()
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  //   @Post('check')
  //   @ApiOperation({
  //     summary:
  //       'Kiểm tra tính tương thích giữa các linh kiện (gửi toàn bộ object)',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Trả về kết quả kiểm tra tính tương thích',
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         isCompatible: { type: 'boolean' },
  //         messages: { type: 'array', items: { type: 'string' } },
  //       },
  //     },
  //   })
  //   checkCompatibility(@Body() compatibilityReq: CompatibilityReq) {
  //     return this.compatibilityService.checkCompatibility(compatibilityReq);
  //   }

  @Post('check')
  @ApiOperation({
    summary:
      'Kiểm tra tính tương thích giữa các linh kiện (gửi danh sách ID sản phẩm và loại)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về kết quả kiểm tra tính tương thích',
    schema: {
      type: 'object',
      properties: {
        isCompatible: { type: 'boolean' },
        messages: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  checkCompatibilityByProductIds(
    @Body() compatibilityByProductIdsReq: CompatibilityByProductIdsReq,
  ) {
    return this.compatibilityService.checkCompatibilityByProductIds(
      compatibilityByProductIdsReq,
    );
  }
}
