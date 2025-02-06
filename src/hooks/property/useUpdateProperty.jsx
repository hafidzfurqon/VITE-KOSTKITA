import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateProperty = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['update.property'],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error('property id is required');
      }
      const response = await axiosInstance.put(`${endpoints.property.update}/${id}`, data);

      return response;
    },
    onSuccess,
    onError,
  });
};
