import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllVisit = () =>
  useQuery({
    queryKey: ['fetch.visit'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.visit_admin.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
