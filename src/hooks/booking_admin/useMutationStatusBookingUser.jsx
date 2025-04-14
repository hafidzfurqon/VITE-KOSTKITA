import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationStatusBookingUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['mutate.status'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.data_booking.change_data, formData);
      return response;
    },
    onSuccess,
    onError,
  });
};
