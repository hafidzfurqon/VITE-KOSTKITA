import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetailVisitProperty = (id) =>
  useQuery({
    queryKey: ['get.detail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.visit_admin.detail}/${id}`);
      console.log(response.data.data.visit);
      return response.data.data.visit;
    },
  });
