import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllServices = (isAdmin) =>
  useQuery({
    queryKey: ['fetch.service'],
    queryFn: async () => {
      const url = isAdmin ? endpoints.service.list : endpoints.service.public.list;
      const response = await axiosInstance.get(url);
      return response.data.data;
    },
  });
