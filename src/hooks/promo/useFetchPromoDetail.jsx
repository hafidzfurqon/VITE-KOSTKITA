import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchPromoDetail = (slug) =>
  useQuery({
    queryKey: ['get.promo', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.promo.public.detail}/${slug}`);
      return response.data.data;
    },
  });
