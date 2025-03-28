import { useMutation } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage } from 'src/utils/axios';

export const useMutationDeleteReview = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['delete.review'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `${EndpointLandingPage.ratingreview.delete}/${id}`
      );
      return response;
    },
    onSuccess,
    onError,
  });
