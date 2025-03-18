import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationAddWishlist = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['add.wishlist'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.wishlist.add, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
