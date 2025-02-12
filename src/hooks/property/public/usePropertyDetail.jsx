import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNewsSlug = (id) => {  
  const { data, isLoading } = useQuery({
    queryKey: ['detail-property'],  
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.property.public.detail}/${id}`);  
      const { data: result } = response.data;
      return result;
    },
  });

  return {
    data,
    isLoading,
  };
};
