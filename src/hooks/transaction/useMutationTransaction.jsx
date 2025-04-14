import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationTransaction = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['add.transaction'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.data_booking.create_new_data, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
