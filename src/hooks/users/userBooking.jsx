import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const userBooking = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['booking.property'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.user.booking.property, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
