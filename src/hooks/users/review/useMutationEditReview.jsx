import { useMutation } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage, endpoints } from 'src/utils/axios';

export const useMutationEditReview = () => {
  return useMutation({
    mutationKey: ['update.review'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(
        `${EndpointLandingPage.ratingreview.update}/${id}`,
        data
      );
      return response.data;
    },
  });
};
