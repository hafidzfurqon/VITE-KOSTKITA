import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchWishlist = () =>
  useQuery({
    queryKey: ['all.wishlist'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.wishlist.list);
      return response.data.data;
    },
  });
