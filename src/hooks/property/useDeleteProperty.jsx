import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteProperty = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.property'],
    mutationFn: async ({ id }) => {
      const response = await axiosInstance.delete(
        `${endpoints.property.delete}/${id}`
      );
      return response;
    },
    onError,
    onSuccess,
  });
};
