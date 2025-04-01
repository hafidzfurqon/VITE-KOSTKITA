import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationTransaction = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['add.transaction'],
    mutationFn: async () => {
      const response = await axiosInstance.post(endpoints);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
