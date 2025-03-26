import { useMutation } from '@tanstack/react-query';
import axiosInstance, { EndpointLandingPage, endpoints } from 'src/utils/axios';

export const useMutationCreateReview = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.review'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(EndpointLandingPage.ratingreview.add, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
