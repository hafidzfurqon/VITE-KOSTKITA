import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useListProperty = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['public.property'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.property.public.list);
      return response.data.data;
    },
  });

  return {
    data,
    isLoading,
    isFetching,
  };
};
