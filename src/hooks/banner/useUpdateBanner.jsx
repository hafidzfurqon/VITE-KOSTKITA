import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateBanner = ({ onSuccess, onError }, id) => {
  return useMutation({
    mutationKey: ['update.banner'],
    mutationFn: async (formData) => {
      if (!id) {
        throw new Error('property ID is required');
      }
      const response = await axiosInstance.post(`${endpoints.banner.update}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response;
    },
    onSuccess,
    onError,
  });
};
