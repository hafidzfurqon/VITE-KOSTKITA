import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteBanner = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.banner'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${endpoints.banner.delete}/${id}`
      );
      return response;
    },
    onError,
    onSuccess,
  });
};
