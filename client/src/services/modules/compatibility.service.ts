import { post } from '../api_client';
import { CompatibilityRequest } from '../types/request/compatibility_types/compatibility.req';
import type { CompatibilityResponse } from '../types/response/compatibility_types/compatibility.res';

export const compatibilityService = {
  checkCompatibility: async (
    request: CompatibilityRequest
  ): Promise<CompatibilityResponse> => {
    const response = await post('/compatibility/check', request);
    return response.data;
  },
};
