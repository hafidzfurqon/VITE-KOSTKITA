import { useQuery } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage } from 'src/utils/axios';

export const useFetchServiceUser = () =>
  useQuery({
    queryKey: ['all.service'],
    queryFn: async () => {
      const response = await axiosInstance.get(EndpointLandingPage.service.list);
      return response.data;
    },
  });
