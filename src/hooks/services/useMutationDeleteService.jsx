import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteService = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.service'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.service.delete}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
