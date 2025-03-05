import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetSectorOwner = (sector_code) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.sector', sector_code],
    queryFn: async () => {
      if (!sector_code) return []; // Jika sector_code tidak ada, kembalikan array kosong
      const response = await axiosInstance.get(`${endpoints.owner.sector.detail}/${sector_code}`);
      console.log("Response sector Data:", response.data.data);
      return response.data.data?.sectors || []; // Ambil hanya data.cities
    },
    enabled: !!sector_code,
  });

  return { data, isLoading, refetch, isFetching };
};
