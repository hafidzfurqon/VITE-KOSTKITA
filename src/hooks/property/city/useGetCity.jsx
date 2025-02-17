import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetCity = (state_code) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.city', state_code],
    queryFn: async () => {
      if (!state_code) return []; // Jika state_code tidak ada, kembalikan array kosong
      const response = await axiosInstance.get(`${endpoints.city.detail}/${state_code}`);
      console.log("Response City Data:", response.data.data.cities);
      return response.data.data?.cities || []; // Ambil hanya data.cities
    },
    enabled: !!state_code,
  });

  return { data, isLoading, refetch, isFetching };
};
