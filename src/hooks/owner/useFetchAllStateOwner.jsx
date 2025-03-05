import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllStateOwner = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.state'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.owner.state.list);
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
