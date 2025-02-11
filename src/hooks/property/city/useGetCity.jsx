import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetCity = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.city'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.city.list);
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
