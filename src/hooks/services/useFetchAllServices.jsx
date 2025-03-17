import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllServices = () =>
  useQuery({
    queryKey: ['fetch.service'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.service.list);
      return response.data.data;
    },
  });
