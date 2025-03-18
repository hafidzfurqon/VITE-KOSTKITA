import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationRemoveWishlist = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['remove.wishlist'],
    mutationFn: async (body) => {
      try {
        const response = await axiosInstance.post(endpoints.wishlist.remove, {
          ...body,
       
        });
        return response.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || 'Gagal menghapus wishlist');
      }
    },
    onSuccess,
    onError,
  });
