import { get, post, put, del } from '../api_client';
import { CreateReviewReq } from '../types/request/review_types/create-review.req';
import { UpdateReviewReq } from '../types/request/review_types/update-review.req';
import { ReviewRes } from '../types/response/review_types/review.res';
import { ReviewListRes } from '../types/response/review_types/review-list.res';

interface ReviewParams {
  page?: number;
  size?: number;
  product_id?: number;
}

// Lấy tất cả review
export const getAllReviews = async (
  params?: ReviewParams
): Promise<ReviewListRes> => {
  const res = await get('/reviews/all', params);
  return res.data;
};

// Lấy review theo id
export const getReviewById = async (id: number): Promise<ReviewRes> => {
  const res = await get(`/reviews/${id}`);
  return res.data;
};

// Lấy review theo product_id
export const getReviewsByProductId = async (
  productId: number,
  params?: ReviewParams
): Promise<ReviewListRes> => {
  const res = await get('/reviews/all', { ...params, product_id: productId });
  return res.data;
};

// Tạo review mới
export const createReview = async (
  data: CreateReviewReq
): Promise<ReviewRes> => {
  const res = await post('/reviews', data);
  return res.data;
};

// Cập nhật review
export const updateReview = async (
  data: UpdateReviewReq
): Promise<ReviewRes> => {
  const res = await put('/reviews/update', data);
  return res.data;
};

// Xóa review
export const deleteReview = async (id: number): Promise<void> => {
  await del(`/reviews/${id}`);
};
