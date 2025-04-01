import { useQuery } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage, endpoints } from 'src/utils/axios';

export const useFetchNontification = (id) =>
  useQuery({
    queryKey: ['fetch.nontification'],
    queryFn: async () => {
      if (id === undefined) {
        return null;
      }
      const response = await axiosInstance.get(EndpointLandingPage.nontification.getNontification);
      return response.data.data;
    },
    enabled: !!id,
  });
