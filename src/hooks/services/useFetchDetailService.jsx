import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetailService = (id) =>
  useQuery({
    queryKey: ['fetch.services', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.service.detail}/${id}`);
      console.log(response.data.data);
      return response.data.data;
    },
    enabled : !!id
  });
