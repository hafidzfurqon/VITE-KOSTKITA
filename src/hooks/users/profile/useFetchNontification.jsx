import { useQuery } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage, endpoints } from 'src/utils/axios';

export const useFetchNontification = () =>
  useQuery({
    queryKey: ['fetch.nontification'],
    queryFn: async () => {
      const response = await axiosInstance.get(EndpointLandingPage.nontification.getNontification);
      return response.data.data;
    },
  });
