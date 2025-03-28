import { useQuery } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage, endpoints } from 'src/utils/axios';

export const useFetchReview = (propertyId) =>
  useQuery({
    queryKey: ['public.review'],
    queryFn: async () => {
      const response = await axiosInstance.get(EndpointLandingPage.ratingreview.public.list, {
        params: { property_id: propertyId }, 
      });
      return response.data.data;
    },
  });
