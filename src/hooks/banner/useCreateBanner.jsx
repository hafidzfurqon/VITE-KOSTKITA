import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useCreateBanner = ({ onSuccess, onError}) => {
  return useMutation({
    mutationKey: ['create.banner'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.banner.create, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
