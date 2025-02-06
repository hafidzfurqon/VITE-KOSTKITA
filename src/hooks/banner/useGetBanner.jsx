import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetBanner = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.banner'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.banner.list);
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
