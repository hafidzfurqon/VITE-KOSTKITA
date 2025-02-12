import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchPropertySlug = (slug) => useQuery({
    queryKey: ['detail-property'],  
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.property.public.detail}/${slug}`);  
      const { data: result } = response.data;
      return result;
    },
})
