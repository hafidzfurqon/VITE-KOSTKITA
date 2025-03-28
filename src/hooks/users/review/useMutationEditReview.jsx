import { useMutation } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage } from 'src/utils/axios';

export const useMutationEditReview = () => {
  return useMutation({
    mutationKey: ['update.review'],
    mutationFn: async ({ id, ...data }) => {
      const response = await axiosInstance.put(
        `${EndpointLandingPage.ratingreview.update}/${id}`,
        data
      );
      return response.data;
    },
    onError: (error) => {
      console.error('Error updating review:', error);
    },
  });
};
