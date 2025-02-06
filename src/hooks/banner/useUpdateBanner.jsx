import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateBanner = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['update.banner'],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error('property ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.banner.update}/${id}`, data);

      return response;
    },
    onSuccess,
    onError,
  });
};
