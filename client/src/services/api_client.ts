import { CustomAxiosResponse } from '@/common/interface/axios';
import { errorMessage } from '@/common/message';
import { getCookie } from 'cookies-next';

import axios from 'axios';
import { accessToken } from '@/constants';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm log để kiểm tra
console.log('BaseURL:', process.env.NEXT_PUBLIC_BASE_URL);

apiClient.interceptors.request.use(
  async (config) => {
    const token = getCookie(accessToken);

    if (typeof token === 'string' && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Axios token:', token);
    return config;
  },
  (error) => {
    console.log('get axios error');
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use((config) => {
  return config;
});

export const get = (
  url: string,
  params: any = {}
): Promise<CustomAxiosResponse> => {
  return new Promise((resolve, reject) => {
    apiClient.get(url, { params }).then(
      (res: CustomAxiosResponse) => {
        resolve(res);
      },
      (err) => {
        errorMessage(err.response?.data.msg || 'something went wrong');
        reject(new Error(err));
      }
    );
  });
};

export const post = (
  url: string,
  data: any = {}
): Promise<CustomAxiosResponse> => {
  return new Promise((resolve, reject) => {
    apiClient.post(url, data).then(
      (res: CustomAxiosResponse) => {
        resolve(res);
      },
      (err) => {
        console.log(err.response?.data);
        errorMessage(err.response?.data || 'something went wrong');
        reject(new Error(err));
      }
    );
  });
};

export const put = (
  url: string,
  data: any = {}
): Promise<CustomAxiosResponse> => {
  return new Promise((resolve, reject) => {
    apiClient.put(url, data).then(
      (res: CustomAxiosResponse) => {
        resolve(res);
      },
      (err) => {
        errorMessage(err.response?.data || 'something went wrong');
        reject(new Error(err));
      }
    );
  });
};

export const patch = (
  url: string,
  data: any = {}
): Promise<CustomAxiosResponse> => {
  return new Promise((resolve, reject) => {
    apiClient.patch(url, data).then(
      (res: CustomAxiosResponse) => {
        resolve(res);
      },
      (err) => {
        errorMessage(err.response?.data || 'something went wrong');
        reject(new Error(err));
      }
    );
  });
};

export const del = (url: string, params: any = {}) => {
  return new Promise((resolve, reject) => {
    apiClient.delete(url, { params }).then(
      (res: CustomAxiosResponse) => {
        resolve(res);
      },
      (err) => {
        errorMessage(err.response?.data || 'something went wrong');
        reject(new Error(err));
      }
    );
  });
};

export const postFormData = (
  url: string,
  formData: FormData
): Promise<CustomAxiosResponse> => {
  return new Promise((resolve, reject) => {
    apiClient
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(
        (res: CustomAxiosResponse) => {
          resolve(res);
        },
        (err) => {
          errorMessage(err.response?.data.msg || 'something went wrong');
          reject(new Error(err));
        }
      );
  });
};

export default apiClient;
