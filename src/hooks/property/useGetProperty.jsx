import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetProperty = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.property'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.property.list);
      return response.data.data;
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
