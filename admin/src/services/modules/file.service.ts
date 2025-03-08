import { del, postFormData } from '../api_client';

export const uploadImage = (data: FormData) => {
  return postFormData('/upload/single', data);
};

export const uploadMultipleImages = (data: FormData) => {
  return postFormData('/upload/multiple', data);
};

export const deleteImage = (publicId: string) => {
  return del(`/upload/${publicId}`);
};
