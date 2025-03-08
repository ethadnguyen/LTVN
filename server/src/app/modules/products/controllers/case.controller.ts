import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CaseService } from '../services/case-product.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CaseRes } from './types/case_types/case.res';
import { CreateCaseReq } from './types/case_types/create-case.req';
import { UpdateCaseReq } from './types/case_types/update-case.req';
import { GetAllProductReq } from './types/get.all.product.req';
import { CaseListRes } from './types/case_types/case-list.res';

@Public()
@Controller('case')
@ApiTags('Case')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({
    status: 201,
    description: 'The case has been successfully created.',
    type: CaseListRes,
  })
  async create(@Body() createCaseDto: CreateCaseReq) {
    return this.caseService.create(createCaseDto);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update a case' })
  @ApiResponse({
    status: 200,
    description: 'The case has been successfully updated.',
    type: CaseRes,
  })
  async update(@Body() updateCaseDto: UpdateCaseReq) {
    return this.caseService.update(updateCaseDto);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all cases' })
  @ApiResponse({
    status: 200,
    description: 'The cases have been successfully retrieved.',
    type: [CaseRes],
  })
  async findAll(@Query() queryParams: GetAllProductReq) {
    return this.caseService.getAllCases(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a case by ID' })
  @ApiResponse({
    status: 200,
    description: 'The case has been successfully retrieved.',
    type: CaseRes,
  })
  async findById(@Param('id') id: number) {
    return this.caseService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a case by ID' })
  @ApiResponse({
    status: 200,
    description: 'The case has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.caseService.delete(id);
  }
}
