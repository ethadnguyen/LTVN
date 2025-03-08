import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewReq } from './types/create-review.req';
import { JwtService } from '@nestjs/jwt';
import { GetAllReviewReq } from './types/get.all.review.req';
import { ReviewListRes } from './types/review-list.res';
import { ReviewRes } from './types/review.res';
import { UpdateReviewReq } from './types/update-review.req';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('reviews')
@ApiBearerAuth()
@ApiTags('Reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Get('/all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all reviews',
    type: ReviewListRes,
  })
  getAllReviews(@Query() queryParams: GetAllReviewReq) {
    return this.reviewService.getAllReviews(queryParams);
  }

  @Public()
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get a review by id',
    type: ReviewRes,
  })
  getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a new review',
    type: ReviewRes,
  })
  createReview(
    @Body() createReviewDto: CreateReviewReq,
    @Headers('Authorization') authorization: string,
  ) {
    const token = authorization.split(' ')[1];
    const decoded = this.jwtService.decode(token);
    const user_id = decoded.user_id;
    return this.reviewService.createReview(createReviewDto, user_id);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update a review',
    type: ReviewRes,
  })
  updateReview(@Body() updateReviewDto: UpdateReviewReq) {
    return this.reviewService.updateReview(updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete a review',
  })
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.deleteReview(id);
  }
}
