import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export const useMutationBookingPaymentMidtrans = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['midtrans.payment'],
    mutationFn: async ({ id, data }) => {
      console.log('Booking ID:', id);
      console.log('Payment Data:', data);
      const response = await axiosInstance.post(`/api/user/booking/property/pay/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
